import { clientConfigSchema } from '../../shared/config'
import { isEmailDeliveryConfigured } from '../utils/env'

export default defineEventHandler((event) => {
  return clientConfigSchema.parse({
    emailEnabled: isEmailDeliveryConfigured(event),
  })
})
