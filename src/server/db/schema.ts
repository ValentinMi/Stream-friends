import { relations } from 'drizzle-orm'
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core'

// Enums
export const userRole = pgEnum('user_role', ['streamer', 'viewer'])
export const sessionMode = pgEnum('session_mode', ['fifo', 'random'])
export const sessionStatus = pgEnum('session_status', [
  'open',
  'closed',
  'in_progress',
  'completed',
])
export const registrationStatus = pgEnum('registration_status', [
  'waiting',
  'selected',
  'played',
])

// Tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  twitchId: text('twitch_id').unique().notNull(),
  displayName: text('display_name').notNull(),
  avatar: text('avatar'),
  role: userRole('role').notNull().default('viewer'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const gameSessions = pgTable('game_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  streamerId: uuid('streamer_id')
    .references(() => users.id)
    .notNull(),
  game: text('game').notNull(),
  maxPlayers: integer('max_players').notNull(),
  mode: sessionMode('mode').notNull().default('fifo'),
  status: sessionStatus('status').notNull().default('open'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const registrations = pgTable('registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .references(() => gameSessions.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  inGameName: text('in_game_name').notNull(),
  status: registrationStatus('status').notNull().default('waiting'),
  registeredAt: timestamp('registered_at').defaultNow(),
  selectedAt: timestamp('selected_at'),
})

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp('expires_at').notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  gameSessions: many(gameSessions),
  registrations: many(registrations),
  sessions: many(sessions),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const gameSessionsRelations = relations(
  gameSessions,
  ({ one, many }) => ({
    streamer: one(users, {
      fields: [gameSessions.streamerId],
      references: [users.id],
    }),
    registrations: many(registrations),
  }),
)

export const registrationsRelations = relations(registrations, ({ one }) => ({
  session: one(gameSessions, {
    fields: [registrations.sessionId],
    references: [gameSessions.id],
  }),
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
}))
