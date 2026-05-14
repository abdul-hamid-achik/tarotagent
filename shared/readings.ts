import { z } from 'zod'
import { spreadDefinitions, spreadTypes } from './tarot'

export const readingStatusValues = ['started', 'cards_drawn', 'completed', 'failed'] as const
export const readingStatusSchema = z.enum(readingStatusValues)
export type ReadingStatus = z.infer<typeof readingStatusSchema>

export const readingEventTypeValues = [
  'landing_viewed',
  'question_started',
  'spread_selected',
  'draw_clicked',
  'reading_started',
  'cards_received',
  'reading_stream_started',
  'reading_completed',
  'reading_failed',
  'share_copied',
  'share_page_viewed',
  'replay_started',
  'email_requested',
  'email_sent',
  'new_reading_started',
] as const

export const readingEventTypeSchema = z.enum(readingEventTypeValues)
export type ReadingEventType = z.infer<typeof readingEventTypeSchema>

export const emailAddressSchema = z
  .string()
  .trim()
  .max(254, 'Email address must be 254 characters or fewer.')
  .email('A valid email address is required.')

export const shareSlugSchema = z
  .string()
  .trim()
  .min(6, 'A reading reference is required.')
  .max(64, 'Reading reference is too long.')
  .regex(/^[a-z0-9-]+$/i, 'Reading reference contains invalid characters.')

export const readingCardSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1),
  numeral: z.string().min(1),
  image: z.string().min(1),
  reversed: z.boolean(),
  position: z.string().min(1),
})

export const storedDrawnCardSchema = readingCardSchema.extend({
  keywords: z.array(z.string().min(1)).min(1),
  uprightMeaning: z.string().min(1),
  reversedMeaning: z.string().min(1),
  description: z.string().min(1),
})

export const createReadingRequestSchema = z.object({
  question: z.string().trim().min(1, 'A question is required for the reading.').max(500),
  spreadType: z.enum(spreadTypes, {
    error: () => ({ message: `Invalid spread type. Must be one of: ${spreadTypes.join(', ')}.` }),
  }),
})

export const analyticsRequestSchema = z.object({
  eventType: readingEventTypeSchema,
  readingId: z.string().uuid().optional(),
  shareSlug: shareSlugSchema.optional(),
  payload: z
    .record(z.string(), z.unknown())
    .default({})
    .refine((payload) => JSON.stringify(payload).length <= 4096, {
      message: 'Analytics payload is too large.',
    }),
})

export const emailRequestSchema = z.object({
  email: emailAddressSchema,
})

export const publicReadingSchema = z.object({
  shareSlug: shareSlugSchema,
  shareUrl: z.url(),
  question: z.string().min(1),
  spreadType: z.enum(spreadTypes),
  spreadName: z.string().min(1),
  spreadDescription: z.string().min(1),
  status: z.literal('completed'),
  cards: z.array(readingCardSchema).min(1),
  revealTimingsMs: z.array(z.number().int().nonnegative()).min(1),
  finalText: z.string().min(1),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime(),
})

export const readingMetadataSchema = z.object({
  id: z.string().uuid(),
  shareSlug: shareSlugSchema,
  shareUrl: z.url(),
  question: z.string().min(1),
  spreadType: z.enum(spreadTypes),
  spreadName: z.string().min(1),
  spreadDescription: z.string().min(1),
  status: readingStatusSchema,
  createdAt: z.string().datetime(),
})

export const readingStreamEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('reading'),
    reading: readingMetadataSchema,
  }),
  z.object({
    type: z.literal('cards'),
    cards: z.array(readingCardSchema).min(1),
    revealTimingsMs: z.array(z.number().int().nonnegative()).min(1),
    status: z.literal('cards_drawn'),
  }),
  z.object({
    type: z.literal('text'),
    content: z.string(),
  }),
  z.object({
    type: z.literal('done'),
    status: z.literal('completed'),
    completedAt: z.string().datetime(),
  }),
  z.object({
    type: z.literal('error'),
    status: z.literal('failed'),
    message: z.string().min(1),
  }),
])

export const spreadOptionSchema = z.object({
  label: z.string(),
  value: z.enum(spreadTypes),
  description: z.string(),
})

export const spreadOptions = spreadTypes.map((spreadType) => ({
  label: spreadDefinitions[spreadType].name,
  value: spreadType,
  description: spreadDefinitions[spreadType].description,
})) satisfies z.infer<typeof spreadOptionSchema>[]

export type ReadingCardPayload = z.infer<typeof readingCardSchema>
export type StoredDrawnCard = z.infer<typeof storedDrawnCardSchema>
export type CreateReadingRequest = z.input<typeof createReadingRequestSchema>
export type ReadingMetadata = z.infer<typeof readingMetadataSchema>
export type ReadingStreamEvent = z.infer<typeof readingStreamEventSchema>
export type AnalyticsRequest = z.input<typeof analyticsRequestSchema>
export type PublicReading = z.infer<typeof publicReadingSchema>
export type EmailRequest = z.input<typeof emailRequestSchema>
