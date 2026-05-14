import { createError, readBody } from 'h3'
import { accountLoginRequestSchema } from '../../../../shared/account'
import { sendAccountLoginCodeEmail } from '../../../services/email'
import { createAccountLoginCode } from '../../../services/persistence'
import { assertRateLimit } from '../../../utils/rate-limit'
import { getOrCreateAnonymousSessionId } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  const parsedBody = accountLoginRequestSchema.safeParse(requestBody)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsedBody.error.issues[0]?.message || 'Invalid login request.',
    })
  }

  const sessionId = getOrCreateAnonymousSessionId(event)
  await assertRateLimit({
    key: `account-login-request:${sessionId}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
    message: 'Too many login code requests. Please try again later.',
  })

  const loginCode = await createAccountLoginCode(parsedBody.data.email)
  if (loginCode) {
    await sendAccountLoginCodeEmail({
      to: loginCode.user.email,
      code: loginCode.code,
    })
  }

  return { ok: true }
})
