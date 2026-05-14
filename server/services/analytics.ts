import type { H3Event } from 'h3'
import { analyticsRequestSchema } from '../../shared/readings'
import { findReadingIdByShareSlug, recordReadingEvent } from './persistence'
import { getOrCreateAnonymousSessionId } from '../utils/session'

export async function trackAnalyticsEvent(event: H3Event, payload: unknown) {
  const parsedPayload = analyticsRequestSchema.parse(payload)
  const sessionId = getOrCreateAnonymousSessionId(event)
  const readingId =
    parsedPayload.readingId ??
    (parsedPayload.shareSlug ? await findReadingIdByShareSlug(parsedPayload.shareSlug) : null)

  return recordReadingEvent({
    eventType: parsedPayload.eventType,
    readingId,
    shareSlug: parsedPayload.shareSlug ?? null,
    sessionId,
    payload: parsedPayload.payload,
  })
}
