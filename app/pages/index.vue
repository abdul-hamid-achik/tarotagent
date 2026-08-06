<script setup lang="ts">
import type { SpreadType } from '~~/shared/tarot'
import type { ClientConfig } from '~~/shared/config'
import { spreadOptions } from '~~/shared/readings'
import { useReadingAnalytics } from '~/composables/useReadingAnalytics'

useSeoMeta({
  title: 'Tarot Agent — Free AI Tarot Readings Online',
  description:
    'Get a free AI-powered tarot reading. Choose from Single Card, Yes/No, Three Card, Love, Career, or Celtic Cross spreads with a full 78-card deck and streaming interpretations by Aurelia.',
})

const { trackEvent } = useReadingAnalytics()
const {
  question,
  spreadType,
  cards,
  readingText,
  finalText,
  isLoading,
  isStreaming,
  isRevealed,
  isReplaying,
  error,
  readingStatus,
  readingId,
  shareSlug,
  shareUrl,
  spreadName,
  spreadDescription,
  revealTimingsMs,
  startReading,
  replayReading,
  reset,
} = useTarotReading()

const shareMessage = useAutoDismissMessage(3000)
const emailMessage = useAutoDismissMessage(3000)
const emailError = useAutoDismissMessage(5000)
const isSendingEmail = ref(false)
const { data: clientConfig } = useFetch<ClientConfig>('/api/config', {
  default: () => ({ emailEnabled: false }),
})
const {
  account,
  readings: accountReadings,
  isLoading: isAccountLoading,
  isSaving: isAccountSaving,
  error: accountError,
  message: accountMessage,
  loadAccount,
  saveAccount,
  requestLoginCode,
  verifyLoginCode,
  logout,
} = useAccount()

const isHydrated = ref(false)
const canRestoreArchive = computed(() => Boolean(clientConfig.value?.emailEnabled))
const hasReading = computed(() => cards.value.length > 0 || isLoading.value)
const canDraw = computed(
  () => isHydrated.value && question.value.trim().length > 0 && !isLoading.value,
)
const isCompleted = computed(
  () => readingStatus.value === 'completed' && finalText.value.length > 0,
)
const isFailed = computed(() => readingStatus.value === 'failed')
const promptSuggestions = [
  'What should I focus on next?',
  'What am I not seeing clearly?',
  'What energy should I work with?',
]

const questionStartedTracked = ref(false)

watch(question, (nextQuestion) => {
  if (!questionStartedTracked.value && nextQuestion.trim().length > 0) {
    questionStartedTracked.value = true
    void trackEvent({
      eventType: 'question_started',
      payload: {
        length: nextQuestion.trim().length,
      },
    })
  }
})

onMounted(() => {
  isHydrated.value = true
  void trackEvent({ eventType: 'landing_viewed' })
  void loadAccount()
})

watch(isCompleted, (completed) => {
  if (completed) {
    void loadAccount()
  }
})

function selectSpread(nextSpreadType: SpreadType) {
  spreadType.value = nextSpreadType
  void trackEvent({
    eventType: 'spread_selected',
    payload: {
      spreadType: nextSpreadType,
    },
  })
}

function usePromptSuggestion(prompt: string) {
  question.value = prompt
}

function handleQuestionKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || (!event.metaKey && !event.ctrlKey) || !canDraw.value) {
    return
  }

  event.preventDefault()
  void handleStartReading()
}

async function handleStartReading() {
  shareMessage.set(null)
  emailMessage.set(null)
  emailError.set(null)

  void trackEvent({
    eventType: 'draw_clicked',
    readingId: readingId.value ?? undefined,
    shareSlug: shareSlug.value ?? undefined,
    payload: {
      spreadType: spreadType.value,
    },
  })

  await startReading()
}

async function handleReplay() {
  void trackEvent({
    eventType: 'replay_started',
    readingId: readingId.value ?? undefined,
    shareSlug: shareSlug.value ?? undefined,
  })

  await replayReading()
}

async function handleShare() {
  if (!shareUrl.value) {
    return
  }

  await navigator.clipboard.writeText(shareUrl.value)
  shareMessage.set('Share link copied.')

  void trackEvent({
    eventType: 'share_copied',
    readingId: readingId.value ?? undefined,
    shareSlug: shareSlug.value ?? undefined,
  })
}

async function handleEmailRequest(email: string) {
  if (!shareSlug.value) {
    return
  }

  emailMessage.set(null)
  emailError.set(null)
  isSendingEmail.value = true

  try {
    await $fetch(`/api/readings/${shareSlug.value}/email`, {
      method: 'POST',
      body: { email },
    })

    emailMessage.set('Reading emailed successfully.')

    void trackEvent({
      eventType: 'email_sent',
      readingId: readingId.value ?? undefined,
      shareSlug: shareSlug.value ?? undefined,
    })
  } catch (caughtError) {
    emailError.set(getFetchErrorMessage(caughtError, 'Unable to email this reading right now.'))
  } finally {
    isSendingEmail.value = false
  }
}

function handleNewReading() {
  void trackEvent({
    eventType: 'new_reading_started',
    readingId: readingId.value ?? undefined,
    shareSlug: shareSlug.value ?? undefined,
  })

  questionStartedTracked.value = false
  shareMessage.set(null)
  emailMessage.set(null)
  emailError.set(null)
  reset()
}

function handleAccountSave(input: { email: string; displayName?: string }) {
  void saveAccount(input)
}

function handleAccountLoginRequest(input: { email: string }) {
  void requestLoginCode(input)
}

function handleAccountLoginVerify(input: { email: string; code: string }) {
  void verifyLoginCode(input)
}

function handleAccountLogout() {
  void logout()
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 sm:gap-10">
    <section class="text-center pt-6 pb-2 sm:pt-8 sm:pb-4">
      <div class="animate-float inline-block mb-6">
        <img
          src="/cards/back.png"
          alt=""
          class="w-20 h-[7.03125rem] sm:w-24 sm:h-[8.4375rem] rounded-lg border border-gold-500/30 shadow-lg shadow-gold-500/10 object-cover"
          aria-hidden="true"
        />
      </div>
      <h2
        class="font-display text-3xl sm:text-4xl font-semibold text-mystic-100 mb-3 tracking-wide"
      >
        Consult the Cards
      </h2>
      <p class="text-mystic-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
        An AI-powered tarot reading experience. Focus your mind, ask your question, and let the
        cards reveal their wisdom.
      </p>
    </section>

    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
      mode="out-in"
    >
      <section v-if="!hasReading" key="input" class="w-full max-w-2xl flex flex-col gap-6">
        <div class="grid gap-2">
          <label for="reading-question" class="text-left text-sm font-medium text-mystic-200">
            Your question
          </label>
          <div
            class="rounded-xl border border-mystic-600/60 bg-mystic-800/45 p-3 shadow-inner shadow-mystic-950/40 transition-colors focus-within:border-gold-500/60 focus-within:bg-mystic-800/65"
          >
            <UTextarea
              id="reading-question"
              v-model="question"
              placeholder="What wisdom do you seek?"
              :rows="3"
              :maxlength="500"
              autoresize
              size="lg"
              class="w-full"
              :disabled="!isHydrated || isLoading"
              aria-describedby="reading-question-hint"
              @keydown="handleQuestionKeydown"
            />
          </div>
          <div
            id="reading-question-hint"
            class="flex items-center justify-between gap-3 text-xs text-mystic-300"
          >
            <span>Ask one focused question for a clearer reading.</span>
            <span class="shrink-0 tabular-nums">{{ question.length }}/500</span>
          </div>
          <div
            v-if="!question.trim()"
            class="flex flex-wrap items-center gap-2 pt-1"
            aria-label="Example questions"
          >
            <span class="text-xs text-mystic-400">Try:</span>
            <button
              v-for="prompt in promptSuggestions"
              :key="prompt"
              type="button"
              class="rounded-full border border-mystic-600/60 px-3 py-1.5 text-left text-xs text-mystic-300 transition-colors hover:border-gold-500/50 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500/50 active:scale-[0.98]"
              @click="usePromptSuggestion(prompt)"
            >
              {{ prompt }}
            </button>
          </div>
        </div>

        <div class="rounded-xl border border-mystic-600/30 bg-mystic-800/40 p-4 sm:p-6">
          <div class="flex flex-col items-center gap-4">
            <div class="w-full">
              <div class="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p class="font-display text-sm uppercase tracking-widest text-gold-300">
                    Choose a spread
                  </p>
                  <p class="mt-1 text-xs text-mystic-400">Match the layout to your question.</p>
                </div>
                <span
                  class="shrink-0 rounded-full border border-mystic-700/60 px-2.5 py-1 text-xs text-mystic-400"
                >
                  {{ spreadOptions.length }} options
                </span>
              </div>
              <div
                class="grid w-full grid-cols-2 gap-2 sm:grid-cols-3"
                role="group"
                aria-label="Select spread type"
                aria-describedby="spread-description"
              >
                <button
                  v-for="option in spreadOptions"
                  :key="option.value"
                  type="button"
                  class="min-h-11 w-full cursor-pointer rounded-lg border px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500/50 active:scale-[0.98]"
                  :class="
                    spreadType === option.value
                      ? 'border-gold-300/80 bg-gold-500 text-mystic-900 shadow-lg shadow-gold-500/20 ring-2 ring-gold-300/25'
                      : 'border-mystic-600/60 bg-mystic-700/40 text-mystic-300 hover:border-gold-500/40 hover:bg-mystic-600/50 hover:text-mystic-100'
                  "
                  :disabled="!isHydrated || isLoading"
                  :aria-pressed="spreadType === option.value"
                  @click="selectSpread(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div
              class="w-full max-w-sm rounded-lg border border-gold-500/20 bg-gold-500/5 px-4 py-3 text-center"
              aria-live="polite"
            >
              <p class="font-display text-sm text-gold-300">
                {{ spreadName }}
              </p>
              <p id="spread-description" class="mt-1 text-sm text-mystic-300">
                {{ spreadDescription }}
              </p>
            </div>

            <div class="w-full border-t border-mystic-700/50 pt-4 text-center">
              <UButton
                type="button"
                size="lg"
                color="primary"
                variant="solid"
                data-testid="draw-cards"
                :loading="isLoading"
                :disabled="!canDraw"
                aria-describedby="draw-hint"
                class="group w-full justify-center px-6 py-3 text-base font-semibold shadow-lg shadow-gold-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-500/25 active:translate-y-0 active:scale-[0.98] disabled:!border-mystic-600/60 disabled:!bg-mystic-700/60 disabled:!text-mystic-400 disabled:!opacity-100 disabled:translate-y-0 disabled:shadow-none sm:min-w-56 sm:w-auto"
                @click="handleStartReading"
              >
                <template #leading>
                  <span
                    v-if="!isLoading"
                    class="transition-transform duration-200 group-hover:rotate-12"
                    aria-hidden="true"
                    >&#10022;</span
                  >
                </template>
                {{ isLoading ? 'Reading the cards...' : 'Draw cards' }}
                <template v-if="!isLoading" #trailing>
                  <span
                    class="hidden rounded border border-black/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider opacity-70 sm:inline"
                    aria-hidden="true"
                  >
                    &#8984; / Ctrl &#8629;
                  </span>
                </template>
              </UButton>
              <p id="draw-hint" class="mt-2 text-center text-xs text-mystic-400">
                <span v-if="!question.trim()">Write a question above to begin.</span>
                <span v-else
                  >No account required. You can save the reading whenever you are ready.</span
                >
              </p>
            </div>
          </div>
        </div>

        <p v-if="error" class="text-red-400 text-sm text-center" role="alert">
          {{ error }}
        </p>
      </section>

      <section v-else key="reading" class="w-full flex flex-col items-center gap-6 sm:gap-8">
        <ReadingMetaCard
          :spread-name="spreadName"
          :question="question"
          :spread-description="spreadDescription"
          :share-slug="shareSlug"
          :share-url="shareUrl"
        />

        <div
          v-if="isLoading && cards.length === 0"
          class="w-full flex justify-center py-8"
          aria-live="polite"
          aria-busy="true"
        >
          <div class="flex flex-col items-center gap-4">
            <div
              class="w-32 aspect-[32/45] sm:w-40 rounded-lg bg-mystic-700/30 animate-pulse border border-mystic-600/20"
            />
            <p class="text-sm text-mystic-400 font-display">Shuffling the deck...</p>
          </div>
        </div>

        <TarotSpread
          v-else
          :cards="cards"
          :spread-type="spreadType"
          :revealed="isRevealed"
          :reveal-timings="revealTimingsMs"
        />

        <div class="w-full max-w-2xl flex flex-col gap-4">
          <ReadingDisplay :text="readingText" :is-streaming="isStreaming" :error="error" />

          <ReadingActions
            v-if="isCompleted"
            :share-url="shareUrl"
            :is-replaying="isReplaying"
            :is-sending-email="isSendingEmail"
            :share-message="shareMessage.message.value"
            :email-message="emailMessage.message.value"
            :email-error="emailError.message.value"
            @share="handleShare"
            @replay="handleReplay"
            @new-reading="handleNewReading"
            @email-request="handleEmailRequest"
          />

          <div v-else-if="isFailed" class="flex flex-wrap gap-3">
            <UButton @click="handleStartReading">Retry Reading</UButton>
            <UButton variant="outline" color="neutral" @click="handleNewReading"
              >New Reading</UButton
            >
          </div>
        </div>
      </section>
    </Transition>

    <AccountPanel
      :account="account"
      :readings="accountReadings"
      :is-loading="!isHydrated || isAccountLoading"
      :is-saving="isAccountSaving"
      :can-restore="canRestoreArchive"
      :message="accountMessage"
      :error="accountError"
      class="max-w-2xl"
      @save="handleAccountSave"
      @login-request="handleAccountLoginRequest"
      @login-verify="handleAccountLoginVerify"
      @logout="handleAccountLogout"
    />
  </div>
</template>
