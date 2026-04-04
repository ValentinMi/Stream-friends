import { Twitch } from 'arctic'

export const twitch = new Twitch(
  process.env.TWITCH_CLIENT_ID!,
  process.env.TWITCH_CLIENT_SECRET!,
  process.env.TWITCH_REDIRECT_URI!
)
