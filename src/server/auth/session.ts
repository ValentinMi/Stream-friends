import { getCookie, setCookie } from '@tanstack/react-start/server'
import { db } from '~/server/db'
import { sessions } from '~/server/db/schema'
import { eq, lt } from 'drizzle-orm'

const THIRTY_DAYS = 30 * 24 * 60 * 60

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + THIRTY_DAYS * 1000)

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  })

  return sessionId
}

export async function validateSession(
  sessionId: string,
): Promise<{ userId: string } | null> {
  const result = await db
    .select({ userId: sessions.userId, expiresAt: sessions.expiresAt })
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1)

  const session = result[0]
  if (!session) return null

  if (session.expiresAt < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId))
    return null
  }

  return { userId: session.userId }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId))
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

export async function getSessionFromCookie(): Promise<{ userId: string } | null> {
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
