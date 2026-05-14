import type { H3Event } from 'h3'
import { createError } from 'h3'
import { z } from 'zod'

const runtimeConfigSchema = z.object({
  databaseUrl: z.string(),
  anthropicApiKey: z.string(),
  resendApiKey: z.string(),
  resendFromEmail: z.string(),
  redisRestUrl: z.string(),
  redisRestToken: z.string(),
  public: z.object({
    siteUrl: z.url(),
    siteName: z.string().trim().min(1),
    emailEnabled: z.boolean(),
  }),
})

export type AppRuntimeConfig = z.infer<typeof runtimeConfigSchema>

function firstNonEmpty(...values: Array<string | undefined | null>): string {
  return values.find((value) => value?.trim())?.trim() ?? ''
}

function resolveRuntimeConfig(config: AppRuntimeConfig): AppRuntimeConfig {
  const databaseUrl = firstNonEmpty(process.env.DATABASE_URL, config.databaseUrl)
  const anthropicApiKey = firstNonEmpty(process.env.ANTHROPIC_API_KEY, config.anthropicApiKey)
  const resendApiKey = firstNonEmpty(process.env.RESEND_API_KEY, config.resendApiKey)
  const resendFromEmail = firstNonEmpty(process.env.RESEND_FROM_EMAIL, config.resendFromEmail)
  const redisRestUrl = firstNonEmpty(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.KV_REST_API_URL,
    config.redisRestUrl,
  )
  const redisRestToken = firstNonEmpty(
    process.env.UPSTASH_REDIS_REST_TOKEN,
    process.env.KV_REST_API_TOKEN,
    config.redisRestToken,
  )

  return {
    ...config,
    databaseUrl,
    anthropicApiKey,
    resendApiKey,
    resendFromEmail,
    redisRestUrl,
    redisRestToken,
    public: {
      ...config.public,
      siteUrl: firstNonEmpty(process.env.SITE_URL, config.public.siteUrl),
      siteName: firstNonEmpty(process.env.SITE_NAME, config.public.siteName),
      emailEnabled: Boolean(resendApiKey && resendFromEmail) || isTestMode(),
    },
  }
}

export function getValidatedRuntimeConfig(event?: H3Event): AppRuntimeConfig {
  const runtimeConfig = event ? useRuntimeConfig(event) : useRuntimeConfig()
  return runtimeConfigSchema.parse(resolveRuntimeConfig(runtimeConfigSchema.parse(runtimeConfig)))
}

export function hasDatabase(event?: H3Event): boolean {
  return getValidatedRuntimeConfig(event).databaseUrl.trim().length > 0
}

export function isTestMode(): boolean {
  return process.env.TAROT_AGENT_TEST_MODE === '1' || process.env.NODE_ENV === 'test'
}

export function requireAnthropicApiKey(event?: H3Event): string {
  const apiKey = getValidatedRuntimeConfig(event).anthropicApiKey.trim()
  if (apiKey) {
    return apiKey
  }

  if (isTestMode()) {
    return 'test-anthropic-key'
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Anthropic API key is not configured.',
  })
}

export function getDatabaseUrl(event?: H3Event): string | null {
  const url = getValidatedRuntimeConfig(event).databaseUrl.trim()
  return url.length > 0 ? url : null
}

export function requireDatabaseUrl(event?: H3Event): string {
  const url = getDatabaseUrl(event)
  if (url) {
    return url
  }

  if (isTestMode()) {
    return ''
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'DATABASE_URL is not configured.',
  })
}

export function requireRedisConfig(event?: H3Event): { url: string; token: string } {
  const config = getValidatedRuntimeConfig(event)
  const url = config.redisRestUrl.trim()
  const token = config.redisRestToken.trim()

  if (url && token) {
    return { url: url.replace(/\/$/, ''), token }
  }

  if (isTestMode()) {
    return { url: '', token: '' }
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Redis/KV rate limiting is not configured.',
  })
}

export function requireResendConfig(event?: H3Event): { apiKey: string; fromEmail: string } {
  const config = getValidatedRuntimeConfig(event)
  const apiKey = config.resendApiKey.trim()
  const fromEmail = config.resendFromEmail.trim()

  if (apiKey && fromEmail) {
    return { apiKey, fromEmail }
  }

  if (isTestMode()) {
    return {
      apiKey: 'test-resend-key',
      fromEmail: 'Tarot Agent <no-reply@example.com>',
    }
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Resend is not configured for reading emails.',
  })
}

export function isEmailDeliveryConfigured(event?: H3Event): boolean {
  const config = getValidatedRuntimeConfig(event)
  return Boolean(config.resendApiKey.trim() && config.resendFromEmail.trim()) || isTestMode()
}
