import { createError, readBody } from 'h3'
import { accountRegisterRequestSchema } from '../../../shared/account'
import {
  AccountEmailConflictError,
  createAccountSession,
  createOrUpdateAccountForSession,
  getAccountDashboard,
  getUserByAccountSessionToken,
} from '../../services/persistence'
import { assertRateLimit } from '../../utils/rate-limit'
import {
  getAccountSessionToken,
  getOrCreateAnonymousSessionId,
  setAccountSessionToken,
} from '../../utils/session'

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  const parsedBody = accountRegisterRequestSchema.safeParse(requestBody)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsedBody.error.issues[0]?.message || 'Invalid account request.',
    })
  }

  const sessionId = getOrCreateAnonymousSessionId(event)
  await assertRateLimit({
    key: `account-register:${sessionId}`,
    limit: 8,
    windowMs: 60 * 60 * 1000,
    message: 'Too many account updates. Please try again later.',
  })

  const currentAccount = await getUserByAccountSessionToken(getAccountSessionToken(event))
  let account: Awaited<ReturnType<typeof createOrUpdateAccountForSession>>

  try {
    account = await createOrUpdateAccountForSession({
      email: parsedBody.data.email,
      displayName: parsedBody.data.displayName,
      sessionId,
      currentUserId: currentAccount?.id ?? null,
    })
  } catch (caughtError) {
    if (caughtError instanceof AccountEmailConflictError) {
      throw createError({
        statusCode: 409,
        statusMessage: caughtError.message,
      })
    }

    throw caughtError
  }

  const accountSession = await createAccountSession(account.id)

  setAccountSessionToken(event, accountSession.token, accountSession.expiresAt)

  return getAccountDashboard(account.id)
})
