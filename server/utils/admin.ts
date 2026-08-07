import { createError } from 'h3'
import type { H3Event } from 'h3'
import type { UserRecord } from '../db/schema'
import { getUserByAccountSessionToken } from '../services/persistence'
import { getValidatedRuntimeConfig } from './env'
import { getAccountSessionToken } from './session'

export async function requireAdminUser(event: H3Event): Promise<UserRecord> {
  const user = await getUserByAccountSessionToken(getAccountSessionToken(event))

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Sign in to access the admin console.',
    })
  }

  const configuredAdminEmail = getValidatedRuntimeConfig(event).adminEmail.trim().toLowerCase()

  if (!configuredAdminEmail || user.email.trim().toLowerCase() !== configuredAdminEmail) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access is restricted.',
    })
  }

  return user
}
