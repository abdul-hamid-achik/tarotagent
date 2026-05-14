import { describe, expect, it } from 'vitest'

describe('rate limit helper', () => {
  it('is bypassed in test mode', async () => {
    process.env.TAROT_AGENT_TEST_MODE = '1'
    const { assertRateLimit } = await import('../../server/utils/rate-limit')

    await expect(
      assertRateLimit({
        key: 'reading:test-session',
        limit: 0,
        windowMs: 60_000,
        message: 'Too many requests.',
      }),
    ).resolves.toBeUndefined()
  })
})
