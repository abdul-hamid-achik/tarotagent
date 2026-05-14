import type {
  PublicReading,
  ReadingMetadata,
  ReadingStatus,
  ReadingStreamEvent,
} from '~~/shared/readings'
import type { ReadingCard, SpreadType } from '~~/shared/tarot'
import { readingStreamEventSchema } from '~~/shared/readings'
import { spreadDefinitions } from '~~/shared/tarot'
import { useReadingAnalytics } from '~/composables/useReadingAnalytics'

export function useTarotReading() {
  const { trackEvent } = useReadingAnalytics()

  const question = ref('')
  const spreadType = ref<SpreadType>('three-card')
  const cards = ref<ReadingCard[]>([])
  const readingText = ref('')
  const finalText = ref('')
  const isLoading = ref(false)
  const isStreaming = ref(false)
  const isRevealed = ref(false)
  const error = ref<string | null>(null)
  const readingStatus = ref<ReadingStatus | null>(null)
  const readingId = ref<string | null>(null)
  const shareSlug = ref<string | null>(null)
  const shareUrl = ref<string | null>(null)
  const spreadName = ref(spreadDefinitions[spreadType.value].name)
  const spreadDescription = ref(spreadDefinitions[spreadType.value].description)
  const revealTimingsMs = ref<number[]>([])
  const isReplaying = ref(false)

  let revealTimer: ReturnType<typeof setTimeout> | null = null
  let replayTextTimer: ReturnType<typeof setInterval> | null = null
  let streamAbortController: AbortController | null = null
  let streamIdleTimer: ReturnType<typeof setTimeout> | null = null
  let streamStartedTracked = false
  let cardsReceivedTracked = false

  const STREAM_IDLE_TIMEOUT_MS = 45_000

  watch(spreadType, (nextSpreadType) => {
    spreadName.value = spreadDefinitions[nextSpreadType].name
    spreadDescription.value = spreadDefinitions[nextSpreadType].description
  })

  function clearTimers() {
    if (revealTimer) {
      clearTimeout(revealTimer)
      revealTimer = null
    }

    if (replayTextTimer) {
      clearInterval(replayTextTimer)
      replayTextTimer = null
    }

    if (streamIdleTimer) {
      clearTimeout(streamIdleTimer)
      streamIdleTimer = null
    }
  }

  function bumpStreamIdleTimer() {
    if (streamIdleTimer) {
      clearTimeout(streamIdleTimer)
    }

    streamIdleTimer = setTimeout(() => {
      streamAbortController?.abort()
    }, STREAM_IDLE_TIMEOUT_MS)
  }

  function resetReadingState() {
    clearTimers()
    cards.value = []
    readingText.value = ''
    finalText.value = ''
    isLoading.value = false
    isStreaming.value = false
    isRevealed.value = false
    error.value = null
    readingStatus.value = null
    readingId.value = null
    shareSlug.value = null
    shareUrl.value = null
    revealTimingsMs.value = []
    isReplaying.value = false
    streamStartedTracked = false
    cardsReceivedTracked = false
  }

  function applyReadingMetadata(metadata: ReadingMetadata) {
    readingId.value = metadata.id
    shareSlug.value = metadata.shareSlug
    shareUrl.value = metadata.shareUrl
    readingStatus.value = metadata.status
    question.value = metadata.question
    spreadType.value = metadata.spreadType
    spreadName.value = metadata.spreadName
    spreadDescription.value = metadata.spreadDescription
  }

  function scheduleReveal() {
    clearTimers()
    revealTimer = setTimeout(() => {
      isRevealed.value = true
      revealTimer = null
    }, 60)
  }

  async function replayReading() {
    if (!finalText.value || cards.value.length === 0) {
      return
    }

    clearTimers()
    error.value = null
    isReplaying.value = true
    isStreaming.value = true
    isRevealed.value = false
    readingText.value = ''
    scheduleReveal()

    let cursor = 0
    replayTextTimer = setInterval(() => {
      cursor = Math.min(finalText.value.length, cursor + 4)
      readingText.value = finalText.value.slice(0, cursor)

      if (cursor >= finalText.value.length) {
        if (replayTextTimer) {
          clearInterval(replayTextTimer)
          replayTextTimer = null
        }

        isStreaming.value = false
        isReplaying.value = false
      }
    }, 18)
  }

  function hydrateSavedReading(reading: PublicReading, mode: 'direct' | 'replay' = 'direct') {
    resetReadingState()
    question.value = reading.question
    spreadType.value = reading.spreadType
    spreadName.value = reading.spreadName
    spreadDescription.value = reading.spreadDescription
    cards.value = reading.cards
    finalText.value = reading.finalText
    readingText.value = mode === 'direct' ? reading.finalText : ''
    readingStatus.value = reading.status
    shareSlug.value = reading.shareSlug
    shareUrl.value = reading.shareUrl
    revealTimingsMs.value = reading.revealTimingsMs
    isRevealed.value = mode === 'direct'

    if (mode === 'replay') {
      void replayReading()
    }
  }

  async function startReading() {
    if (isLoading.value || isStreaming.value) {
      return
    }

    clearTimers()
    streamAbortController?.abort()
    error.value = null
    isLoading.value = true
    isStreaming.value = false
    isRevealed.value = false
    isReplaying.value = false
    cards.value = []
    readingText.value = ''
    finalText.value = ''
    revealTimingsMs.value = []
    readingStatus.value = null
    readingId.value = null
    shareSlug.value = null
    shareUrl.value = null
    streamStartedTracked = false
    cardsReceivedTracked = false

    streamAbortController = new AbortController()
    bumpStreamIdleTimer()

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.value,
          spreadType: spreadType.value,
        }),
        signal: streamAbortController.signal,
      })

      if (!response.ok) {
        const body = await response.text()
        throw new Error(body || `Request failed with status ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('The reading stream could not be opened.')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        bumpStreamIdleTimer()
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) {
            continue
          }

          const eventPayload = trimmed.slice(6)
          if (!eventPayload) {
            continue
          }

          let parsedEvent: ReadingStreamEvent | null = null
          try {
            const unknownEvent = JSON.parse(eventPayload)
            const result = readingStreamEventSchema.safeParse(unknownEvent)
            parsedEvent = result.success ? result.data : null
          } catch {
            parsedEvent = null
          }

          if (!parsedEvent) {
            continue
          }

          if (parsedEvent.type === 'reading') {
            applyReadingMetadata(parsedEvent.reading)
            continue
          }

          if (parsedEvent.type === 'cards') {
            cards.value = parsedEvent.cards
            revealTimingsMs.value = parsedEvent.revealTimingsMs
            readingStatus.value = parsedEvent.status
            isLoading.value = false
            scheduleReveal()

            if (!cardsReceivedTracked) {
              cardsReceivedTracked = true
              void trackEvent({
                eventType: 'cards_received',
                readingId: readingId.value ?? undefined,
                shareSlug: shareSlug.value ?? undefined,
              })
            }

            continue
          }

          if (parsedEvent.type === 'text') {
            isLoading.value = false
            isStreaming.value = true
            readingText.value += parsedEvent.content
            finalText.value += parsedEvent.content

            if (!streamStartedTracked) {
              streamStartedTracked = true
            }

            continue
          }

          if (parsedEvent.type === 'done') {
            isLoading.value = false
            isStreaming.value = false
            isReplaying.value = false
            readingStatus.value = parsedEvent.status
            continue
          }

          if (parsedEvent.type === 'error') {
            throw new Error(parsedEvent.message || 'An error occurred during the reading.')
          }
        }
      }
    } catch (caughtError) {
      const aborted = caughtError instanceof DOMException && caughtError.name === 'AbortError'
      error.value = aborted
        ? 'The reading timed out. Please try again.'
        : caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong'
      isLoading.value = false
      isStreaming.value = false
      isReplaying.value = false
      readingStatus.value = 'failed'
    } finally {
      if (streamIdleTimer) {
        clearTimeout(streamIdleTimer)
        streamIdleTimer = null
      }
      streamAbortController = null
    }
  }

  function reset() {
    resetReadingState()
    question.value = ''
    spreadType.value = 'three-card'
    spreadName.value = spreadDefinitions['three-card'].name
    spreadDescription.value = spreadDefinitions['three-card'].description
  }

  onBeforeUnmount(() => {
    clearTimers()
    streamAbortController?.abort()
    streamAbortController = null
  })

  return {
    question,
    spreadType,
    cards,
    readingText,
    finalText,
    isLoading,
    isStreaming,
    isRevealed,
    error,
    readingStatus,
    readingId,
    shareSlug,
    shareUrl,
    spreadName,
    spreadDescription,
    revealTimingsMs,
    isReplaying,
    startReading,
    replayReading,
    hydrateSavedReading,
    reset,
  }
}
