import { createError, readBody, sendStream, setResponseHeader } from 'h3'
import { createReadingRequestSchema } from '../../shared/readings'
import { getSpreadRevealTimings } from '../../shared/tarot'
import {
  completeReadingRecord,
  createReadingRecord,
  failReadingRecord,
  getUserByAccountSessionToken,
  markReadingCardsDrawn,
  recordReadingEvent,
  toReadingCard,
} from '../services/persistence'
import { createReadingStream, drawCards } from '../utils/tarot-agent'
import { getValidatedRuntimeConfig, requireAiGatewayApiKey } from '../utils/env'
import { assertRateLimit } from '../utils/rate-limit'
import { getAccountSessionToken, getOrCreateAnonymousSessionId } from '../utils/session'

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  const parsedBody = createReadingRequestSchema.safeParse(requestBody)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsedBody.error.issues[0]?.message || 'Invalid reading request.',
    })
  }

  const sessionId = getOrCreateAnonymousSessionId(event)
  await assertRateLimit({
    key: `reading:${sessionId}`,
    limit: 12,
    windowMs: 60 * 60 * 1000,
    message: 'Too many readings requested. Please try again later.',
  })

  const account = await getUserByAccountSessionToken(getAccountSessionToken(event))
  const question = parsedBody.data.question.trim()
  const spreadType = parsedBody.data.spreadType
  const reading = await createReadingRecord({
    question,
    spreadType,
    sessionId,
    userId: account?.id ?? null,
  })

  await recordReadingEvent({
    eventType: 'reading_started',
    readingId: reading.id,
    shareSlug: reading.shareSlug,
    sessionId,
    payload: {
      spreadType,
    },
  })

  try {
    const gatewayApiKey = requireAiGatewayApiKey(event)
    const runtimeConfig = getValidatedRuntimeConfig(event)
    const cards = drawCards(spreadType, `${question}:${spreadType}`)
    const revealTimingsMs = getSpreadRevealTimings(spreadType)

    await markReadingCardsDrawn({
      readingId: reading.id,
      cards,
      revealTimingsMs,
    })

    const stream = await createReadingStream({
      gatewayApiKey,
      question,
      spreadType,
      cards,
      gatewayUser: account?.id ?? sessionId,
      appUrl: runtimeConfig.public.siteUrl,
      initialEvents: [
        { type: 'reading', reading },
        {
          type: 'cards',
          cards: cards.map((card) => toReadingCard(card)),
          revealTimingsMs,
          status: 'cards_drawn',
        },
      ],
      onFirstTextChunk: async () => {
        await recordReadingEvent({
          eventType: 'reading_stream_started',
          readingId: reading.id,
          shareSlug: reading.shareSlug,
          sessionId,
        })
      },
      onComplete: async (finalText) => {
        await completeReadingRecord({
          readingId: reading.id,
          finalText,
        })

        await recordReadingEvent({
          eventType: 'reading_completed',
          readingId: reading.id,
          shareSlug: reading.shareSlug,
          sessionId,
          payload: {
            characterCount: finalText.length,
          },
        })
      },
      onError: async (error) => {
        await failReadingRecord({
          readingId: reading.id,
          errorMessage: error.message,
        })

        await recordReadingEvent({
          eventType: 'reading_failed',
          readingId: reading.id,
          shareSlug: reading.shareSlug,
          sessionId,
          payload: {
            message: error.message,
          },
        })
      },
    })

    setResponseHeader(event, 'Content-Type', 'text/event-stream')
    setResponseHeader(event, 'Cache-Control', 'no-cache')
    setResponseHeader(event, 'Connection', 'keep-alive')

    return sendStream(event, stream)
  } catch (error) {
    const normalizedError =
      error instanceof Error ? error : new Error('Failed to start this reading.')

    await failReadingRecord({
      readingId: reading.id,
      errorMessage: normalizedError.message,
    })

    await recordReadingEvent({
      eventType: 'reading_failed',
      readingId: reading.id,
      shareSlug: reading.shareSlug,
      sessionId,
      payload: {
        message: normalizedError.message,
      },
    })

    throw createError({
      statusCode:
        'statusCode' in normalizedError && typeof normalizedError.statusCode === 'number'
          ? normalizedError.statusCode
          : 500,
      statusMessage: normalizedError.message,
    })
  }
})
