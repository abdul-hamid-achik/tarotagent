import { z } from 'zod'

export const clientConfigSchema = z.object({
  emailEnabled: z.boolean(),
})

export type ClientConfig = z.infer<typeof clientConfigSchema>
