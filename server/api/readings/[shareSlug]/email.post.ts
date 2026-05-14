import { createError, getRouterParam, readBody } from 'h3'
import { emailRequestSchema, shareSlugSchema } from '../../../../shared/readings'
import { sendReadingEmail } from '../../../services/email'
import {
  getCompletedReadingForDelivery,
  getPublicReadingByShareSlug,
  logEmailDelivery,
  recordReadingEvent,
} from '../../../services/persistence'
import { assertRateLimit } from '../../../utils/rate-limit'
import { getOrCreateAnonymousSessionId } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const parsedShareSlug = shareSlugSchema.safeParse(getRouterParam(event, 'shareSlug'))

  if (!parsedShareSlug.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsedShareSlug.error.issues[0]?.message || 'A reading reference is required.',
    })
  }
  const shareSlug = parsedShareSlug.data

  const body = await readBody(event)
  const parsedBody = emailRequestSchema.safeParse(body)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsedBody.error.issues[0]?.message || 'A valid email address is required.',
    })
  }

  const sessionId = getOrCreateAnonymousSessionId(event)
  await assertRateLimit({
    key: `email:${sessionId}`,
    limit: 6,
    windowMs: 60 * 60 * 1000,
    message: 'Too many email requests. Please try again later.',
  })

  const readingRecord = await getCompletedReadingForDelivery(shareSlug)
  const publicReading = await getPublicReadingByShareSlug(shareSlug)

  if (!readingRecord || !publicReading) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Only completed readings can be emailed.',
    })
  }

  const email = parsedBody.data.email

  await recordReadingEvent({
    eventType: 'email_requested',
    readingId: readingRecord.id,
    shareSlug,
    sessionId,
    payload: {
      emailDomain: email.split('@')[1] || null,
    },
  })

  try {
    const delivery = await sendReadingEmail({
      to: email,
      reading: publicReading,
    })

    await logEmailDelivery({
      readingId: readingRecord.id,
      sessionId,
      email,
      provider: delivery.provider,
      providerMessageId: delivery.id,
      status: 'sent',
      metadata: {
        shareSlug,
      },
    })

    await recordReadingEvent({
      eventType: 'email_sent',
      readingId: readingRecord.id,
      shareSlug,
      sessionId,
      payload: {
        provider: delivery.provider,
      },
    })

    return {
      ok: true,
      id: delivery.id,
    }
  } catch (error) {
    const normalizedError =
      error instanceof Error ? error : new Error('Unable to send this reading email.')

    await logEmailDelivery({
      readingId: readingRecord.id,
      sessionId,
      email,
      provider: 'resend',
      status: 'failed',
      errorMessage: normalizedError.message,
      metadata: {
        shareSlug,
      },
    })

    throw createError({
      statusCode: 502,
      statusMessage: 'Email delivery is not available right now. Please try again later.',
    })
  }
})
