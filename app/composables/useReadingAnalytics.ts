import type { AnalyticsRequest } from '~~/shared/readings'

export function useReadingAnalytics() {
  async function trackEvent(payload: AnalyticsRequest) {
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
