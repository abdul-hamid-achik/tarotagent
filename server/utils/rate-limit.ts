import { createError } from 'h3'
import { isTestMode, requireRedisConfig } from './env'

type RateLimitOptions = {
  key: string
  limit: number
  windowMs: number
  message: string
}

const RATE_LIMIT_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("PEXPIRE", KEYS[1], ARGV[1])
end
return current
`

async function redisCommand<T>(command: unknown[]): Promise<T> {
  const { url, token } = requireRedisConfig()
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })

  if (!response.ok) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Rate limiting is temporarily unavailable.',
    })
  }

  const body = (await response.json()) as { result?: T; error?: string }
  if (body.error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Rate limiting is temporarily unavailable.',
    })
  }

  return body.result as T
}

export async function assertRateLimit(options: RateLimitOptions) {
  if (isTestMode()) {
    return
  }

  const key = `rate-limit:${options.key}`
  const count = Number(
    await redisCommand<number>(['EVAL', RATE_LIMIT_SCRIPT, '1', key, options.windowMs]),
  )

  if (count > options.limit) {
    throw createError({
      statusCode: 429,
      statusMessage: options.message,
    })
  }
}
