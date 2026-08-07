import { track } from '@vercel/analytics'
import type { AnalyticsRequest } from '~~/shared/readings'

type VercelAnalyticsProperties = Record<string, string | number | boolean | null | undefined>

const vercelPropertyNames = {
  characterCount: 'character_count',
  durationMs: 'duration_ms',
  emailEnabled: 'email_enabled',
  length: 'question_length',
  mode: 'mode',
  source: 'source',
  spreadType: 'spread_type',
  status: 'status',
} as const

function getVercelProperties(payload: AnalyticsRequest): VercelAnalyticsProperties {
  const properties: VercelAnalyticsProperties = {
    has_reading_id: Boolean(payload.readingId),
    has_share_slug: Boolean(payload.shareSlug),
  }

  for (const [sourceName, vercelName] of Object.entries(vercelPropertyNames)) {
    const value = payload.payload?.[sourceName]

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    ) {
      properties[vercelName] = value
    }
  }

  return properties
}

export function useReadingAnalytics() {
  async function trackEvent(payload: AnalyticsRequest) {
    if (import.meta.client) {
      try {
        track(`tarot_${payload.eventType}`, getVercelProperties(payload))
      } catch {
        // Vercel Analytics must never block the reading experience.
      }
    }

    try {
      await $fetch('/api/analytics', {
        method: 'POST',
        body: payload,
        keepalive: true,
      })
    } catch {
      // Analytics failures should never block the reading experience.
    }
  }

  return {
    trackEvent,
  }
}
