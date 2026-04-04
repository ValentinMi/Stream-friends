import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
  useRouteContext,
} from '@tanstack/react-router'
import { createServerFn, Meta, Scripts } from '@tanstack/react-start'
import type { ReactNode } from 'react'
import { getSessionFromCookie } from '~/server/auth/session'
import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import appCss from '~/styles/app.css?url'

export type User = {
  id: string
  displayName: string
  avatar: string | null
  role: 'streamer' | 'viewer'
} | null

export interface RootRouteContext {
  user: User
}

const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const session = getSessionFromCookie()
  if (!session) return null

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

  return result[0] ?? null
})

export const Route = createRootRouteWithContext<RootRouteContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Stream Friends' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  beforeLoad: async () => {
    const user = await getUser()
    return { user }
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function Navbar() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
            Stream Friends
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <a
                  href="/api/auth/logout"
                  className="rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Logout
                </a>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
