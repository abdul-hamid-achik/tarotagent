import { readBody } from 'h3'
import { trackAnalyticsEvent } from '../services/analytics'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await trackAnalyticsEvent(event, body)

  return {
    ok: true,
  }
})
