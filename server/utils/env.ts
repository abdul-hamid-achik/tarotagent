import type { H3Event } from 'h3'
import { createError } from 'h3'
import { z } from 'zod'

const rawRuntimeConfigSchema = z.object({
  databaseUrl: z.string(),
  aiGatewayApiKey: z.string(),
  adminEmail: z.string(),
  resendApiKey: z.string(),
  resendFromEmail: z.string(),
  redisRestUrl: z.string(),
  redisRestToken: z.string(),
  public: z.object({
    siteUrl: z.string().trim().min(1),
    siteName: z.string().trim().min(1),
    emailEnabled: z.boolean(),
  }),
})

const runtimeConfigSchema = rawRuntimeConfigSchema.extend({
  public: rawRuntimeConfigSchema.shape.public.extend({
    siteUrl: z.url(),
  }),
})

export type AppRuntimeConfig = z.infer<typeof runtimeConfigSchema>
type RawRuntimeConfig = z.infer<typeof rawRuntimeConfigSchema>

function firstNonEmpty(...values: Array<string | undefined | null>): string {
  return values.find((value) => value?.trim())?.trim() ?? ''
}

/**
 * Environment managers generally remove dotenv quotes for us, but a key copied
 * with literal outer quotes should not make it to the provider unchanged.
 */
function normalizeConfiguredSecret(value: string): string {
  let normalized = value.trim()

  while (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1).trim()
  }

  return normalized.replace(/^['"]+|['"]+$/g, '').trim()
}

function redisRestConfigFromKvUrl(value: string | undefined): { url: string; token: string } {
  if (!value?.trim()) {
    return { url: '', token: '' }
  }

  try {
    const redisUrl = new URL(value)
    if (!['redis:', 'rediss:'].includes(redisUrl.protocol)) {
      return { url: '', token: '' }
    }

    return {
      url: redisUrl.hostname ? `https://${redisUrl.hostname}` : '',
      token: redisUrl.password ? decodeURIComponent(redisUrl.password) : '',
    }
  } catch {
    return { url: '', token: '' }
  }
}

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || /^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

function resolveRuntimeConfig(config: RawRuntimeConfig): AppRuntimeConfig {
  const databaseUrl = firstNonEmpty(process.env.DATABASE_URL, config.databaseUrl)
  const aiGatewayApiKey = normalizeConfiguredSecret(
    firstNonEmpty(process.env.AI_GATEWAY_API_KEY, config.aiGatewayApiKey),
  )
  const adminEmail = firstNonEmpty(process.env.ADMIN_EMAIL, config.adminEmail).toLowerCase()
  const resendApiKey = firstNonEmpty(process.env.RESEND_API_KEY, config.resendApiKey)
  const resendFromEmail = firstNonEmpty(process.env.RESEND_FROM_EMAIL, config.resendFromEmail)
  const kvUrlRedisConfig = redisRestConfigFromKvUrl(process.env.KV_URL)
  const redisRestUrl = firstNonEmpty(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.KV_REST_API_URL,
    kvUrlRedisConfig.url,
    config.redisRestUrl,
  )
  const redisRestToken = firstNonEmpty(
    process.env.UPSTASH_REDIS_REST_TOKEN,
    process.env.KV_REST_API_TOKEN,
    kvUrlRedisConfig.token,
    config.redisRestToken,
  )

  return {
    ...config,
    databaseUrl,
    aiGatewayApiKey,
    adminEmail,
    resendApiKey,
    resendFromEmail,
    redisRestUrl,
    redisRestToken,
    public: {
      ...config.public,
      siteUrl: normalizeSiteUrl(firstNonEmpty(process.env.SITE_URL, config.public.siteUrl)),
      siteName: firstNonEmpty(process.env.SITE_NAME, config.public.siteName),
      emailEnabled: Boolean(resendApiKey && resendFromEmail) || isTestMode(),
    },
  }
}

export function getValidatedRuntimeConfig(event?: H3Event): AppRuntimeConfig {
  const runtimeConfig = event ? useRuntimeConfig(event) : useRuntimeConfig()
  return runtimeConfigSchema.parse(
    resolveRuntimeConfig(rawRuntimeConfigSchema.parse(runtimeConfig)),
  )
}

export function hasDatabase(event?: H3Event): boolean {
  return getValidatedRuntimeConfig(event).databaseUrl.trim().length > 0
}

export function isTestMode(): boolean {
  return process.env.TAROT_AGENT_TEST_MODE === '1' || process.env.NODE_ENV === 'test'
}

export function requireAiGatewayApiKey(event?: H3Event): string {
  const apiKey = normalizeConfiguredSecret(getValidatedRuntimeConfig(event).aiGatewayApiKey)
  if (apiKey) {
    return apiKey
  }

  if (isTestMode()) {
    return 'test-ai-gateway-key'
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'AI Gateway API key is not configured.',
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
