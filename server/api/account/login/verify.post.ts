import { createError, readBody } from 'h3'
import { accountLoginVerifyRequestSchema } from '../../../../shared/account'
import {
  createAccountSession,
  getAccountDashboard,
  verifyAccountLoginCode,
} from '../../../services/persistence'
import { assertRateLimit } from '../../../utils/rate-limit'
import { getOrCreateAnonymousSessionId, setAccountSessionToken } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  const parsedBody = accountLoginVerifyRequestSchema.safeParse(requestBody)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsedBody.error.issues[0]?.message || 'Invalid login code.',
    })
  }

  const sessionId = getOrCreateAnonymousSessionId(event)
  await assertRateLimit({
    key: `account-login-verify:${sessionId}`,
    limit: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too many login attempts. Please request a new code later.',
  })

  const account = await verifyAccountLoginCode({
    email: parsedBody.data.email,
    code: parsedBody.data.code,
    sessionId,
  })

  if (!account) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired login code.',
    })
  }

  const accountSession = await createAccountSession(account.id)
  setAccountSessionToken(event, accountSession.token, accountSession.expiresAt)

  return getAccountDashboard(account.id)
})
