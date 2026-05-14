import type { H3Event } from 'h3'
import { deleteCookie, getCookie, setCookie } from 'h3'

const SESSION_COOKIE_NAME = 'tarot_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 365
const ACCOUNT_SESSION_COOKIE_NAME = 'tarot_account'

export function getOrCreateAnonymousSessionId(event: H3Event): string {
  const existingSessionId = getCookie(event, SESSION_COOKIE_NAME)

  if (existingSessionId) {
    return existingSessionId
  }

  const sessionId = crypto.randomUUID()

  setCookie(event, SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  return sessionId
}

export function getAccountSessionToken(event: H3Event): string | null {
  return getCookie(event, ACCOUNT_SESSION_COOKIE_NAME) ?? null
}

export function setAccountSessionToken(event: H3Event, token: string, expiresAt: Date) {
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))

  setCookie(event, ACCOUNT_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  })
}

export function clearAccountSessionToken(event: H3Event) {
  deleteCookie(event, ACCOUNT_SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}
