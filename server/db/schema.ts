import { sql } from 'drizzle-orm'
import { index, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import {
  readingEventTypeSchema,
  readingStatusSchema,
  storedDrawnCardSchema,
  type ReadingStatus,
  type ReadingEventType,
  type StoredDrawnCard,
} from '../../shared/readings'
import { spreadTypes, type SpreadType } from '../../shared/tarot'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('displayName'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  lastSeenAt: timestamp('lastSeenAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
})

export const userSessions = pgTable(
  'userSessions',
  {
    id: text('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('tokenHash').notNull().unique(),
    createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    expiresAt: timestamp('expiresAt', { withTimezone: true, mode: 'date' }).notNull(),
  },
  (table) => [index('userSessions_userId_idx').on(table.userId)],
)

export const accountLoginCodes = pgTable(
  'accountLoginCodes',
  {
    id: text('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    codeHash: text('codeHash').notNull().unique(),
    createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    expiresAt: timestamp('expiresAt', { withTimezone: true, mode: 'date' }).notNull(),
    consumedAt: timestamp('consumedAt', { withTimezone: true, mode: 'date' }),
  },
  (table) => [index('accountLoginCodes_email_idx').on(table.email)],
)

export const readings = pgTable(
  'readings',
  {
    id: text('id').primaryKey(),
    shareSlug: text('shareSlug').notNull().unique(),
    sessionId: text('sessionId').notNull(),
    userId: text('userId').references(() => users.id, { onDelete: 'set null' }),
    status: text('status').$type<ReadingStatus>().notNull(),
    question: text('question').notNull(),
    spreadType: text('spreadType').$type<SpreadType>().notNull(),
    spreadName: text('spreadName').notNull(),
    spreadDescription: text('spreadDescription').notNull(),
    cards: jsonb('cards').$type<StoredDrawnCard[] | null>(),
    revealTimingsMs: jsonb('revealTimingsMs').$type<number[] | null>(),
    finalText: text('finalText'),
    errorMessage: text('errorMessage'),
    createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    completedAt: timestamp('completedAt', { withTimezone: true, mode: 'date' }),
    failedAt: timestamp('failedAt', { withTimezone: true, mode: 'date' }),
  },
  (table) => [index('readings_userId_idx').on(table.userId)],
)

export const readingEvents = pgTable('readingEvents', {
  id: text('id').primaryKey(),
  readingId: text('readingId').references(() => readings.id, { onDelete: 'set null' }),
  shareSlug: text('shareSlug'),
  sessionId: text('sessionId').notNull(),
  eventType: text('eventType').$type<ReadingEventType>().notNull(),
  payload: jsonb('payload')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
})

export const emailDeliveries = pgTable('emailDeliveries', {
  id: text('id').primaryKey(),
  readingId: text('readingId')
    .notNull()
    .references(() => readings.id, { onDelete: 'cascade' }),
  sessionId: text('sessionId').notNull(),
  email: text('email').notNull(),
  provider: text('provider').notNull(),
  providerMessageId: text('providerMessageId'),
  status: text('status').notNull(),
  errorMessage: text('errorMessage'),
  metadata: jsonb('metadata')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  sentAt: timestamp('sentAt', { withTimezone: true, mode: 'date' }),
})

export const readingSelectSchema = createSelectSchema(readings, {
  status: readingStatusSchema,
  spreadType: z.enum(spreadTypes),
  cards: z.array(storedDrawnCardSchema).nullable(),
  revealTimingsMs: z.array(z.number().int().nonnegative()).nullable(),
})
export const readingInsertSchema = createInsertSchema(readings, {
  status: readingStatusSchema,
  spreadType: z.enum(spreadTypes),
  cards: z.array(storedDrawnCardSchema).nullable(),
  revealTimingsMs: z.array(z.number().int().nonnegative()).nullable(),
})
export const readingEventSelectSchema = createSelectSchema(readingEvents, {
  eventType: readingEventTypeSchema,
  payload: z.record(z.string(), z.unknown()),
})
export const readingEventInsertSchema = createInsertSchema(readingEvents, {
  eventType: readingEventTypeSchema,
  payload: z.record(z.string(), z.unknown()),
})
export const emailDeliverySelectSchema = createSelectSchema(emailDeliveries, {
  status: z.enum(['sent', 'failed']),
  metadata: z.record(z.string(), z.unknown()),
})
export const emailDeliveryInsertSchema = createInsertSchema(emailDeliveries, {
  status: z.enum(['sent', 'failed']),
  metadata: z.record(z.string(), z.unknown()),
})
export const userSelectSchema = createSelectSchema(users)
export const userInsertSchema = createInsertSchema(users)
export const userSessionSelectSchema = createSelectSchema(userSessions)
export const userSessionInsertSchema = createInsertSchema(userSessions)
export const accountLoginCodeSelectSchema = createSelectSchema(accountLoginCodes)
export const accountLoginCodeInsertSchema = createInsertSchema(accountLoginCodes)

export type ReadingRecord = typeof readings.$inferSelect
export type NewReadingRecord = typeof readings.$inferInsert
export type ReadingEventRecord = typeof readingEvents.$inferSelect
export type NewReadingEventRecord = typeof readingEvents.$inferInsert
export type EmailDeliveryRecord = typeof emailDeliveries.$inferSelect
export type NewEmailDeliveryRecord = typeof emailDeliveries.$inferInsert
export type UserRecord = typeof users.$inferSelect
export type NewUserRecord = typeof users.$inferInsert
export type UserSessionRecord = typeof userSessions.$inferSelect
export type NewUserSessionRecord = typeof userSessions.$inferInsert
export type AccountLoginCodeRecord = typeof accountLoginCodes.$inferSelect
export type NewAccountLoginCodeRecord = typeof accountLoginCodes.$inferInsert
