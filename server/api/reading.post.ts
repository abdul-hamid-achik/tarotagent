import { sendStream, setResponseHeader, readBody, createError } from 'h3'
import { performReading } from '../utils/tarot-agent'
import { spreadDefinitions } from '../utils/tarot-data'
import type { SpreadType } from '../utils/tarot-data'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.question || typeof body.question !== 'string' || body.question.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A question is required for the reading.',
    })
  }

  const spreadType = body.spreadType as SpreadType
  if (!spreadType || !spreadDefinitions[spreadType]) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid spread type. Must be one of: single, three-card, celtic-cross.',
    })
  }

  const config = useRuntimeConfig()
  const apiKey = config.anthropicApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Anthropic API key is not configured.',
    })
  }

  const { stream } = await performReading(apiKey, body.question.trim(), spreadType)

  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  return sendStream(event, stream)
})
