import type {
  Account,
  AccountLoginRequest,
  AccountLoginVerifyRequest,
  AccountReadingSummary,
  AccountResponse,
} from '~~/shared/account'

export function useAccount() {
  const account = ref<Account | null>(null)
  const readings = ref<AccountReadingSummary[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)
  const message = ref<string | null>(null)

  function applyResponse(response: AccountResponse) {
    account.value = response.account
    readings.value = response.readings
  }

  function getErrorMessage(caughtError: unknown, fallback: string) {
    if (caughtError && typeof caughtError === 'object') {
      const errorData = caughtError as {
        data?: { statusMessage?: string; message?: string }
        statusMessage?: string
        message?: string
      }

      return (
        errorData.data?.statusMessage ||
        errorData.data?.message ||
        errorData.statusMessage ||
        errorData.message ||
        fallback
      )
    }

    return fallback
  }

  async function loadAccount() {
    isLoading.value = true
    error.value = null

    try {
      applyResponse(await $fetch<AccountResponse>('/api/account'))
    } catch (caughtError) {
      error.value = getErrorMessage(caughtError, 'Unable to load your account.')
    } finally {
      isLoading.value = false
    }
  }

  async function saveAccount(input: { email: string; displayName?: string }) {
    isSaving.value = true
    error.value = null
    message.value = null

    try {
      applyResponse(
        await $fetch<AccountResponse>('/api/account/register', {
          method: 'POST',
          body: input,
        }),
      )
      message.value = 'Account saved.'
    } catch (caughtError) {
      error.value = getErrorMessage(caughtError, 'Unable to save this account.')
    } finally {
      isSaving.value = false
    }
  }

  async function requestLoginCode(input: AccountLoginRequest) {
    isSaving.value = true
    error.value = null
    message.value = null

    try {
      await $fetch('/api/account/login/request', {
        method: 'POST',
        body: input,
      })
      message.value = 'If that archive exists, a login code has been sent.'
    } catch (caughtError) {
      error.value = getErrorMessage(caughtError, 'Unable to send a login code.')
    } finally {
      isSaving.value = false
    }
  }

  async function verifyLoginCode(input: AccountLoginVerifyRequest) {
    isSaving.value = true
    error.value = null
    message.value = null

    try {
      applyResponse(
        await $fetch<AccountResponse>('/api/account/login/verify', {
          method: 'POST',
          body: input,
        }),
      )
      message.value = 'Archive restored.'
    } catch (caughtError) {
      error.value = getErrorMessage(caughtError, 'Unable to restore this archive.')
    } finally {
      isSaving.value = false
    }
  }

  async function logout() {
    isSaving.value = true
    error.value = null
    message.value = null

    try {
      await $fetch('/api/account/logout', {
        method: 'POST',
      })
      account.value = null
      readings.value = []
      message.value = 'Signed out.'
    } catch (caughtError) {
      error.value = getErrorMessage(caughtError, 'Unable to sign out.')
    } finally {
      isSaving.value = false
    }
  }

  return {
    account,
    readings,
    isLoading,
    isSaving,
    error,
    message,
    loadAccount,
    saveAccount,
    requestLoginCode,
    verifyLoginCode,
    logout,
  }
}
