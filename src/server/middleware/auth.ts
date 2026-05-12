import { createMiddleware } from '@tanstack/react-start'
import { getSessionFromCookie } from '~/server/auth/session'
import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

type AuthUser = {
  id: string
  displayName: string
  avatar: string | null
  role: 'streamer' | 'viewer'
} | null

export const authMiddleware = createMiddleware().server(
  async ({ next }) => {
    const session = await getSessionFromCookie()
    if (!session) {
      return next({ context: { user: null as AuthUser } })
    }

    const result = await db
      .select({
        id: users.id,
        displayName: users.displayName,
        avatar: users.avatar,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    const user: AuthUser = result[0] ?? null
    return next({ context: { user } })
  },
)
