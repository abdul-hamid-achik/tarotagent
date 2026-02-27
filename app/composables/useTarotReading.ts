import type { DrawnCard, SpreadType } from '~/types/tarot'

export function useTarotReading() {
  const question = ref('')
  const spreadType = ref<SpreadType>('three-card')
  const cards = ref<DrawnCard[]>([])
  const readingText = ref('')
  const isLoading = ref(false)
  const isStreaming = ref(false)
  const isRevealed = ref(false)
  const error = ref<string | null>(null)

  async function startReading() {
    error.value = null
    isLoading.value = true
    isStreaming.value = false
    isRevealed.value = false
    cards.value = []
    readingText.value = ''

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.value,
          spreadType: spreadType.value,
        }),
      })

      if (!response.ok) {
        const body = await response.text()
        throw new Error(body || `Request failed with status ${response.status}`)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        // Keep the last potentially incomplete line in the buffer
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue

          const jsonStr = trimmed.slice(6)
          if (!jsonStr) continue

          let event: Record<string, unknown>
          try {
            event = JSON.parse(jsonStr)
          } catch {
            continue // Skip malformed JSON lines
          }

          if (event.type === 'cards') {
            cards.value = event.cards as DrawnCard[]
            isLoading.value = false
            setTimeout(() => {
              isRevealed.value = true
            }, 300)
          } else if (event.type === 'text') {
            isStreaming.value = true
            readingText.value += event.content as string
          } else if (event.type === 'done') {
            isStreaming.value = false
          } else if (event.type === 'error') {
            throw new Error((event.message as string) || 'An error occurred during the reading')
          }
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Something went wrong'
      isLoading.value = false
      isStreaming.value = false
    }
  }

  function reset() {
    question.value = ''
    spreadType.value = 'three-card'
    cards.value = []
    readingText.value = ''
    isLoading.value = false
    isStreaming.value = false
    isRevealed.value = false
    error.value = null
  }

  return {
    question,
    spreadType,
    cards,
    readingText,
    isLoading,
    isStreaming,
    isRevealed,
    error,
    startReading,
    reset,
  }
}
