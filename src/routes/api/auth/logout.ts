import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getCookie } from '@tanstack/react-start/server'
import {
  invalidateSession,
  clearSessionCookie,
} from '~/server/auth'

export const APIRoute = createAPIFileRoute('/api/auth/logout')({
  POST: async () => {
    const sessionId = getCookie('session')
    if (sessionId) {
      await invalidateSession(sessionId)
    }
    clearSessionCookie()

    return new Response(null, {
      status: 302,
      headers: { Location: '/' },
    })
  },
})
