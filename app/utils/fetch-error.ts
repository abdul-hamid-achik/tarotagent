export function getFetchErrorMessage(caughtError: unknown, fallback: string) {
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
