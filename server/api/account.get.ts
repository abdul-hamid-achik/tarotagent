import { getAccountDashboardBySessionToken } from '../services/persistence'
import { getAccountSessionToken } from '../utils/session'

export default defineEventHandler(async (event) => {
  return getAccountDashboardBySessionToken(getAccountSessionToken(event))
})
