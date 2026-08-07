import { z } from 'zod'
import { readingEventTypeSchema, readingStatusSchema, shareSlugSchema } from './readings'
import { spreadTypes } from './tarot'

const adminCountMapSchema = z.record(z.string(), z.number().int().nonnegative())

export const adminReadingSchema = z.object({
  id: z.string().uuid(),
  shareSlug: shareSlugSchema,
  shareUrl: z.url(),
  question: z.string().min(1),
  spreadType: z.enum(spreadTypes),
  spreadName: z.string().min(1),
  status: readingStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  failedAt: z.string().datetime().nullable(),
  errorMessage: z.string().nullable(),
  eventCounts: adminCountMapSchema,
})

export const adminEventSchema = z.object({
  eventType: readingEventTypeSchema,
  readingId: z.string().uuid().nullable(),
  shareSlug: shareSlugSchema.nullable(),
  question: z.string().nullable(),
  spreadName: z.string().nullable(),
  createdAt: z.string().datetime(),
  payload: z.record(z.string(), z.unknown()),
})

export const adminSpreadBreakdownSchema = z.object({
  spreadType: z.enum(spreadTypes),
  spreadName: z.string().min(1),
  count: z.number().int().nonnegative(),
})

export const adminEventBreakdownSchema = z.object({
  eventType: readingEventTypeSchema,
  count: z.number().int().nonnegative(),
})

export const adminOverviewSchema = z.object({
  generatedAt: z.string().datetime(),
  summary: z.object({
    totalReadings: z.number().int().nonnegative(),
    completedReadings: z.number().int().nonnegative(),
    failedReadings: z.number().int().nonnegative(),
    inProgressReadings: z.number().int().nonnegative(),
    shareCopies: z.number().int().nonnegative(),
    shareViews: z.number().int().nonnegative(),
    replays: z.number().int().nonnegative(),
    emailsSent: z.number().int().nonnegative(),
  }),
  spreadBreakdown: z.array(adminSpreadBreakdownSchema),
  eventBreakdown: z.array(adminEventBreakdownSchema),
  recentReadings: z.array(adminReadingSchema),
  recentEvents: z.array(adminEventSchema),
})

export type AdminReading = z.infer<typeof adminReadingSchema>
export type AdminEvent = z.infer<typeof adminEventSchema>
export type AdminOverview = z.infer<typeof adminOverviewSchema>
