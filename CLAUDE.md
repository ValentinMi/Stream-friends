# Stream Friends

## Project Overview

Stream Friends is a web app for Twitch streamers to organize their community and play with their viewers. Streamers create game sessions, viewers register to join, and the streamer picks players (FIFO or random). Includes viewer stats and leaderboards.

- **Target**: Single streamer per instance (not a multi-tenant platform)
- **Auth**: Twitch OAuth 2.0 only
- **Model**: Freemium (monetization deferred, architecture should support it later)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (React, SSR, server functions) |
| Router | TanStack Router (file-based, type-safe) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Validation | Zod |
| Auth | Twitch OAuth 2.0 (Arctic library) |
| Real-time | Server-Sent Events (SSE) |
| Language | TypeScript (strict mode) |

## Project Structure

```
src/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Landing page
│   ├── dashboard/       # Streamer dashboard routes
│   └── session/         # Game session routes (viewer-facing)
├── server/
│   ├── db/
│   │   ├── schema.ts    # Drizzle schema definitions
│   │   ├── index.ts     # DB connection
│   │   └── migrations/  # Drizzle migrations
│   ├── auth/            # Twitch OAuth logic
│   ├── functions/       # Server functions (RPC-style)
│   └── sse/             # Server-Sent Events handlers
├── components/          # Shared React components
├── hooks/               # Custom React hooks
├── lib/                 # Shared utilities, types, constants
└── styles/              # Global styles, Tailwind config
```

## Database Schema

Core tables: `users`, `game_sessions`, `registrations`, `player_stats`.

- `users`: Twitch-authenticated users with role (streamer | viewer)
- `game_sessions`: Created by streamer, has game name, max players, mode (fifo | random), status (open | closed | in_progress | completed)
- `registrations`: Viewer sign-ups for a session, tracks status (waiting | selected | played)
- `player_stats`: Aggregated viewer participation stats

All schema definitions live in `src/server/db/schema.ts` using Drizzle ORM.

## Coding Conventions

### General
- TypeScript strict mode, no `any` types
- Use Zod for all external input validation (API params, form data, OAuth responses)
- Prefer server functions over raw API routes when possible
- Use TanStack Router loaders for data fetching on route load

### Naming
- Files: kebab-case (`game-session.ts`)
- Components: PascalCase (`GameSession.tsx`)
- Functions/variables: camelCase
- DB columns: snake_case (Drizzle handles mapping)
- Types/interfaces: PascalCase, no `I` prefix

### Components
- Functional components only
- Colocate component-specific logic in the same file unless reused
- Shared components go in `src/components/`

### Database
- All queries go through Drizzle — no raw SQL
- Migrations managed via `drizzle-kit`
- Never delete migration files, always create new ones

### Auth & Security
- All streamer-only actions must check user role server-side
- Viewers can only read their own data and public session info
- Validate Twitch tokens on every authenticated request
- Never expose secrets in client code

### Styling
- Tailwind utility classes, no custom CSS unless absolutely necessary
- Mobile-first responsive design (viewers are often on mobile)

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio
```

## MVP Phases

### Phase 1 — Foundations (current)
- Project setup (TanStack Start + Tailwind + Drizzle + PostgreSQL)
- Twitch OAuth authentication (streamer + viewer login)
- Base data model and migrations
- Layout: streamer dashboard / viewer view

### Phase 2 — Game Queue (core feature)
- Streamer creates game sessions (game, max players, mode)
- Viewers register with in-game name
- Streamer picks players (FIFO or random draw)
- Real-time queue updates via SSE
- Session history + cooldown system

### Phase 3 — Stats & Profiles
- Viewer profile: participation count, games played
- Community leaderboard
- Streamer dashboard: registration stats, active viewers

### Deferred
- Twitch/Discord bot integration
- OBS overlay
- Tournament/bracket mode
- YouTube/Kick support
- Payment system for freemium tiers
- Push notifications
