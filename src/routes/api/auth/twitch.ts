import { createAPIFileRoute } from '@tanstack/react-start/api'
import { setCookie } from 'vinxi/http'
import { twitch } from '~/server/auth'

export const APIRoute = createAPIFileRoute('/api/auth/twitch')({
  GET: async () => {
    const state = crypto.randomUUID()
    const url = twitch.createAuthorizationURL(state, ['user:read:email'])

    setCookie('oauth_state', state, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 600,
    })

    return new Response(null, {
      status: 302,
      headers: { Location: url.toString() },
    })
  },
})
