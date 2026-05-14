import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const EMPTY_RUNTIME_CONFIG = {
  databaseUrl: '',
  anthropicApiKey: '',
  resendApiKey: '',
  resendFromEmail: '',
  redisRestUrl: '',
  redisRestToken: '',
  public: {
    siteUrl: 'http://localhost:3000',
    siteName: 'Tarot Agent',
    emailEnabled: false,
  },
}

describe('runtime environment helpers', () => {
  const originalEnv = {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    databaseUrl: process.env.DATABASE_URL,
    resendApiKey: process.env.RESEND_API_KEY,
    resendFromEmail: process.env.RESEND_FROM_EMAIL,
    upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL,
    upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    siteUrl: process.env.SITE_URL,
    siteName: process.env.SITE_NAME,
  }

  beforeEach(() => {
    ;(globalThis as { useRuntimeConfig?: () => unknown }).useRuntimeConfig = () =>
      EMPTY_RUNTIME_CONFIG

    process.env.ANTHROPIC_API_KEY = 'runtime-anthropic-key'
    process.env.DATABASE_URL = 'postgres://runtime-database-url'
    process.env.RESEND_API_KEY = 'runtime-resend-key'
    process.env.RESEND_FROM_EMAIL = 'Tarot Agent <no-reply@example.com>'
    process.env.UPSTASH_REDIS_REST_URL = 'https://runtime-redis.upstash.io'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'runtime-redis-token'
    process.env.SITE_URL = 'https://example.com'
    process.env.SITE_NAME = 'Runtime Tarot'
  })

  afterEach(() => {
    if (originalEnv.anthropicApiKey === undefined) delete process.env.ANTHROPIC_API_KEY
    else process.env.ANTHROPIC_API_KEY = originalEnv.anthropicApiKey

    if (originalEnv.databaseUrl === undefined) delete process.env.DATABASE_URL
    else process.env.DATABASE_URL = originalEnv.databaseUrl

    if (originalEnv.resendApiKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = originalEnv.resendApiKey

    if (originalEnv.resendFromEmail === undefined) delete process.env.RESEND_FROM_EMAIL
    else process.env.RESEND_FROM_EMAIL = originalEnv.resendFromEmail

    if (originalEnv.upstashRedisRestUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL
    else process.env.UPSTASH_REDIS_REST_URL = originalEnv.upstashRedisRestUrl

    if (originalEnv.upstashRedisRestToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN
    else process.env.UPSTASH_REDIS_REST_TOKEN = originalEnv.upstashRedisRestToken

    if (originalEnv.siteUrl === undefined) delete process.env.SITE_URL
    else process.env.SITE_URL = originalEnv.siteUrl

    if (originalEnv.siteName === undefined) delete process.env.SITE_NAME
    else process.env.SITE_NAME = originalEnv.siteName
  })

  it('resolves standard deployment env vars at runtime', async () => {
    const {
      getValidatedRuntimeConfig,
      hasDatabase,
      isEmailDeliveryConfigured,
      requireAnthropicApiKey,
      requireResendConfig,
    } = await import('../../server/utils/env')

    const config = getValidatedRuntimeConfig()

    expect(config).toMatchObject({
      databaseUrl: 'postgres://runtime-database-url',
      anthropicApiKey: 'runtime-anthropic-key',
      resendApiKey: 'runtime-resend-key',
      resendFromEmail: 'Tarot Agent <no-reply@example.com>',
      redisRestUrl: 'https://runtime-redis.upstash.io',
      redisRestToken: 'runtime-redis-token',
      public: {
        siteUrl: 'https://example.com',
        siteName: 'Runtime Tarot',
        emailEnabled: true,
      },
    })
    expect(hasDatabase()).toBe(true)
    expect(requireAnthropicApiKey()).toBe('runtime-anthropic-key')
    expect(requireResendConfig()).toEqual({
      apiKey: 'runtime-resend-key',
      fromEmail: 'Tarot Agent <no-reply@example.com>',
    })
    expect(isEmailDeliveryConfigured()).toBe(true)
  })
})
