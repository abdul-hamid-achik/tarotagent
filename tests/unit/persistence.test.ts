import { beforeEach, describe, expect, it } from 'vitest'

describe('persistence service', () => {
  beforeEach(async () => {
    process.env.TAROT_AGENT_TEST_MODE = '1'
    ;(globalThis as { useRuntimeConfig?: () => unknown }).useRuntimeConfig = () => ({
      databaseUrl: '',
      aiGatewayApiKey: '',
      resendApiKey: '',
      resendFromEmail: '',
      redisRestUrl: '',
      redisRestToken: '',
      public: {
        siteUrl: 'http://localhost:3000',
        siteName: 'Tarot Agent',
        emailEnabled: false,
      },
    })

    const { resetInMemoryPersistence } = await import('../../server/services/persistence')
    resetInMemoryPersistence()
  })

  it('creates, completes, and exposes a sanitized public reading', async () => {
    const {
      createReadingRecord,
      completeReadingRecord,
      getPublicReadingByShareSlug,
      markReadingCardsDrawn,
    } = await import('../../server/services/persistence')
    const { drawCards } = await import('../../server/utils/tarot-agent')

    const reading = await createReadingRecord({
      question: 'What should I focus on next?',
      spreadType: 'three-card',
      sessionId: 'session-1',
    })

    const cards = drawCards('three-card', 'focus-seed')

    await markReadingCardsDrawn({
      readingId: reading.id,
      cards,
      revealTimingsMs: [200, 400, 600],
    })

    await completeReadingRecord({
      readingId: reading.id,
      finalText: 'A steady path opens when you stop negotiating with what you already know.',
    })

    const publicReading = await getPublicReadingByShareSlug(reading.shareSlug)

    expect(publicReading).toMatchObject({
      shareSlug: reading.shareSlug,
      shareUrl: `http://localhost:3000/r/${reading.shareSlug}`,
      question: 'What should I focus on next?',
      spreadType: 'three-card',
      status: 'completed',
      finalText: 'A steady path opens when you stop negotiating with what you already know.',
      revealTimingsMs: [200, 400, 600],
    })
    expect(publicReading?.cards).toHaveLength(3)
    expect(publicReading).not.toHaveProperty('sessionId')
    expect(publicReading).not.toHaveProperty('userId')
    expect(publicReading?.completedAt).toBeTruthy()
  })

  it('records analytics events against the persisted reading', async () => {
    const { createReadingRecord, listReadingEventsForReading, recordReadingEvent } =
      await import('../../server/services/persistence')

    const reading = await createReadingRecord({
      question: 'How do I move forward?',
      spreadType: 'single',
      sessionId: 'session-analytics',
    })

    await recordReadingEvent({
      eventType: 'reading_started',
      readingId: reading.id,
      shareSlug: reading.shareSlug,
      sessionId: 'session-analytics',
      payload: { spreadType: 'single' },
    })

    await recordReadingEvent({
      eventType: 'reading_completed',
      readingId: reading.id,
      shareSlug: reading.shareSlug,
      sessionId: 'session-analytics',
      payload: { characterCount: 128 },
    })

    const events = await listReadingEventsForReading(reading.id)

    expect(events).toHaveLength(2)
    expect(events.map((event) => event.eventType).sort()).toEqual([
      'reading_completed',
      'reading_started',
    ])
    expect(events[0]).toMatchObject({
      readingId: reading.id,
      shareSlug: reading.shareSlug,
      sessionId: 'session-analytics',
    })
  })

  it('creates an account, claims anonymous readings, and resolves account sessions', async () => {
    const {
      createAccountSession,
      createOrUpdateAccountForSession,
      completeReadingRecord,
      createReadingRecord,
      getAccountDashboard,
      getUserByAccountSessionToken,
    } = await import('../../server/services/persistence')

    const reading = await createReadingRecord({
      question: 'What should I keep?',
      spreadType: 'single',
      sessionId: 'session-account',
    })
    await completeReadingRecord({
      readingId: reading.id,
      finalText: 'Hold what still has roots.',
    })

    const account = await createOrUpdateAccountForSession({
      email: 'Seer@Example.com',
      displayName: 'Seer',
      sessionId: 'session-account',
    })
    const accountSession = await createAccountSession(account.id)
    const resolvedAccount = await getUserByAccountSessionToken(accountSession.token)
    const dashboard = await getAccountDashboard(account.id)

    expect(account.email).toBe('seer@example.com')
    expect(resolvedAccount?.id).toBe(account.id)
    expect(dashboard.account).toMatchObject({
      id: account.id,
      email: 'seer@example.com',
      displayName: 'Seer',
    })
    expect(dashboard.readings).toHaveLength(1)
    expect(dashboard.readings[0]).toMatchObject({
      id: reading.id,
      question: 'What should I keep?',
      shareSlug: reading.shareSlug,
    })
  })

  it('restores an existing archive with a one-time login code', async () => {
    const {
      createAccountLoginCode,
      createOrUpdateAccountForSession,
      createReadingRecord,
      completeReadingRecord,
      getAccountDashboard,
      verifyAccountLoginCode,
    } = await import('../../server/services/persistence')

    const account = await createOrUpdateAccountForSession({
      email: 'seer@example.com',
      displayName: 'Seer',
      sessionId: 'original-session',
    })
    const reading = await createReadingRecord({
      question: 'What follows me?',
      spreadType: 'single',
      sessionId: 'restore-session',
    })
    await completeReadingRecord({
      readingId: reading.id,
      finalText: 'Only what you keep feeding.',
    })

    const loginCode = await createAccountLoginCode('SEER@example.com')
    const restoredAccount = await verifyAccountLoginCode({
      email: 'seer@example.com',
      code: loginCode?.code ?? '',
      sessionId: 'restore-session',
    })
    const dashboard = await getAccountDashboard(account.id)

    expect(loginCode?.code).toMatch(/^\d{6}$/)
    expect(restoredAccount?.id).toBe(account.id)
    expect(dashboard.readings).toHaveLength(1)
    expect(dashboard.readings[0]?.id).toBe(reading.id)

    await expect(
      verifyAccountLoginCode({
        email: 'seer@example.com',
        code: loginCode?.code ?? '',
        sessionId: 'another-session',
      }),
    ).resolves.toBeNull()
  })

  it('rejects taking over an existing email from another account session', async () => {
    const { AccountEmailConflictError, createOrUpdateAccountForSession } =
      await import('../../server/services/persistence')

    const account = await createOrUpdateAccountForSession({
      email: 'Seer@Example.com',
      displayName: 'Seer',
      sessionId: 'session-account',
    })

    await expect(
      createOrUpdateAccountForSession({
        email: 'seer@example.com',
        displayName: 'Different Seer',
        sessionId: 'different-session',
      }),
    ).rejects.toBeInstanceOf(AccountEmailConflictError)

    const updatedAccount = await createOrUpdateAccountForSession({
      email: 'seer@example.com',
      displayName: 'Updated Seer',
      sessionId: 'session-account',
      currentUserId: account.id,
    })

    expect(updatedAccount.displayName).toBe('Updated Seer')
  })
})
