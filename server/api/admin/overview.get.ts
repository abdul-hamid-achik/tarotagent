import { setResponseHeader } from 'h3'
import { getAdminOverview } from '../../services/persistence'
import { requireAdminUser } from '../../utils/admin'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  setResponseHeader(event, 'Cache-Control', 'no-store')

  return getAdminOverview()
})
