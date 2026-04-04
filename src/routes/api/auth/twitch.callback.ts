import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getCookie } from 'vinxi/http'
import { eq } from 'drizzle-orm'
import { twitch } from '~/server/auth'
import { createSession, setSessionCookie } from '~/server/auth'
import { db } from '~/server/db'
import { users } from '~/server/db/schema'

export const APIRoute = createAPIFileRoute('/api/auth/twitch/callback')({
  GET: async ({ request }) => {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const storedState = getCookie('oauth_state')

    if (!code || !state || state !== storedState) {
      return new Response('Invalid OAuth state', { status: 400 })
    }

    const tokens = await twitch.validateAuthorizationCode(code)
    const accessToken = tokens.accessToken()

    const twitchRes = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID!,
      },
    })

    const twitchData = (await twitchRes.json()) as {
      data: Array<{
        id: string
        display_name: string
        profile_image_url: string
      }>
    }
    const twitchUser = twitchData.data[0]

    const [user] = await db
      .insert(users)
      .values({
        twitchId: twitchUser.id,
        displayName: twitchUser.display_name,
        avatar: twitchUser.profile_image_url,
      })
      .onConflictDoUpdate({
        target: users.twitchId,
        set: {
          displayName: twitchUser.display_name,
          avatar: twitchUser.profile_image_url,
        },
      })
      .returning()

    const sessionId = createSession(user.id)
    setSessionCookie(sessionId)

    return new Response(null, {
      status: 302,
      headers: { Location: '/dashboard' },
    })
  },
})
