import { clearAccountSessionToken, getAccountSessionToken } from '../../utils/session'
import { deleteAccountSession } from '../../services/persistence'

export default defineEventHandler(async (event) => {
  await deleteAccountSession(getAccountSessionToken(event))
  clearAccountSessionToken(event)

  return { ok: true }
})
