import { getCookie, setCookie } from 'vinxi/http'

interface Session {
  userId: string
  expiresAt: Date
}

// TODO: Replace in-memory session store with database table or Redis before production.
// Sessions are lost on server restart with the current implementation.
const sessions = new Map<string, Session>()

const THIRTY_DAYS = 30 * 24 * 60 * 60

export function createSession(userId: string): string {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + THIRTY_DAYS * 1000)
  sessions.set(sessionId, { userId, expiresAt })
  return sessionId
}

export function validateSession(
  sessionId: string
): { userId: string } | null {
  const session = sessions.get(sessionId)
  if (!session) return null
  if (session.expiresAt < new Date()) {
    sessions.delete(sessionId)
    return null
  }
  return { userId: session.userId }
}

export function invalidateSession(sessionId: string): void {
  sessions.delete(sessionId)
}

export function setSessionCookie(sessionId: string): void {
  setCookie('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: THIRTY_DAYS,
  })
}

export function getSessionFromCookie(): { userId: string } | null {
  const sessionId = getCookie('session')
  if (!sessionId) return null
  return validateSession(sessionId)
}

export function clearSessionCookie(): void {
  setCookie('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
