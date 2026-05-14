import { getValidatedRuntimeConfig } from '../utils/env'

export default defineNitroPlugin(() => {
  getValidatedRuntimeConfig()
})
