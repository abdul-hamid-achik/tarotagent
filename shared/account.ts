import { z } from 'zod'
import { emailAddressSchema, readingStatusSchema, shareSlugSchema } from './readings'
import { spreadTypes } from './tarot'

export const accountSchema = z.object({
  id: z.string().uuid(),
  email: emailAddressSchema,
  displayName: z.string().nullable(),
  createdAt: z.string().datetime(),
  lastSeenAt: z.string().datetime(),
})

export const accountReadingSummarySchema = z.object({
  id: z.string().uuid(),
  shareSlug: shareSlugSchema,
  shareUrl: z.url(),
  question: z.string().min(1),
  spreadType: z.enum(spreadTypes),
  spreadName: z.string().min(1),
  status: readingStatusSchema,
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
})

export const accountResponseSchema = z.object({
  account: accountSchema.nullable(),
  readings: z.array(accountReadingSummarySchema),
})

export const accountRegisterRequestSchema = z.object({
  email: emailAddressSchema,
  displayName: z.string().trim().max(80, 'Name must be 80 characters or fewer.').optional(),
})

export const accountLoginRequestSchema = z.object({
  email: emailAddressSchema,
})

export const accountLoginVerifyRequestSchema = z.object({
  email: emailAddressSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code from your email.'),
})

export type Account = z.infer<typeof accountSchema>
export type AccountReadingSummary = z.infer<typeof accountReadingSummarySchema>
export type AccountResponse = z.infer<typeof accountResponseSchema>
export type AccountRegisterRequest = z.input<typeof accountRegisterRequestSchema>
export type AccountLoginRequest = z.input<typeof accountLoginRequestSchema>
export type AccountLoginVerifyRequest = z.input<typeof accountLoginVerifyRequestSchema>
