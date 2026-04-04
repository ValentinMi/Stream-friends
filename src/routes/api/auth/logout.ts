import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getCookie } from 'vinxi/http'
import {
  invalidateSession,
  clearSessionCookie,
} from '~/server/auth'

export const APIRoute = createAPIFileRoute('/api/auth/logout')({
  GET: async () => {
    const sessionId = getCookie('session')
    if (sessionId) {
      invalidateSession(sessionId)
    }
    clearSessionCookie()

    return new Response(null, {
      status: 302,
      headers: { Location: '/' },
    })
  },
})
