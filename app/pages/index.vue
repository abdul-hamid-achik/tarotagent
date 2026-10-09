<script setup lang="ts">
import type { SpreadType } from '~~/shared/tarot'
import { spreadDefinitions } from '~~/shared/tarot'
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
const accountModalOpen = ref(false)
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

function cardCountLabel(spread: SpreadType) {
  const count = spreadDefinitions[spread].positions.length
  return count === 1 ? '1 card' : `${count} cards`
}

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

function openAccountModal() {
  accountModalOpen.value = true
}

function closeAccountModal() {
  accountModalOpen.value = false
}
</script>

<template>
  <div class="flex w-full flex-col items-center" :class="hasReading ? 'gap-6' : 'gap-8 sm:gap-14'">
    <section
      class="flex w-full flex-col items-center text-center"
      :class="hasReading ? 'pt-0' : 'pt-0 sm:pt-6'"
    >
      <div
        v-if="!hasReading"
        class="animate-float relative mb-6 h-28 w-40 sm:mb-8 sm:h-48 sm:w-72"
        aria-hidden="true"
      >
        <img
          src="/cards/back.png"
          alt=""
          class="absolute bottom-0 left-[8%] h-[5.25rem] w-[3.75rem] origin-bottom -rotate-[11deg] rounded-lg border border-gold-500/25 object-cover shadow-2xl shadow-mystic-950/70 sm:left-[10%] sm:h-[8.5rem] sm:w-[6.05rem]"
        />
        <img
          src="/cards/back.png"
          alt=""
          class="absolute bottom-0 right-[8%] h-[5.25rem] w-[3.75rem] origin-bottom rotate-[11deg] rounded-lg border border-gold-500/25 object-cover shadow-2xl shadow-mystic-950/70 sm:right-[10%] sm:h-[8.5rem] sm:w-[6.05rem]"
        />
        <img
          src="/cards/back.png"
          alt=""
          class="absolute left-1/2 top-0 z-10 h-[5.9rem] w-[4.2rem] -translate-x-1/2 rounded-lg border border-gold-400/40 object-cover shadow-2xl shadow-gold-500/15 sm:h-[9.5rem] sm:w-[6.75rem]"
        />
      </div>
      <h2
        class="font-display font-semibold tracking-[0.06em] text-mystic-100"
        :class="hasReading ? 'text-xl sm:text-2xl' : 'text-3xl leading-tight sm:text-6xl'"
      >
        Consult the Cards
      </h2>
      <p
        v-if="!hasReading"
        class="mx-auto mt-4 max-w-md text-base leading-relaxed text-mystic-300 sm:mt-5 sm:text-lg"
      >
        Ask one question, choose a spread, and let Aurelia read the cards.
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
      <section v-if="!hasReading" key="input" class="w-full max-w-2xl">
        <div
          class="rounded-[2rem] border border-white/[0.06] bg-mystic-800/25 p-1.5 shadow-[0_30px_80px_-30px_rgba(5,5,20,0.7)]"
        >
          <div
            class="rounded-[calc(2rem-0.375rem)] border border-mystic-700/50 bg-mystic-900/85 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] sm:p-7"
          >
            <div class="grid gap-3">
              <label for="reading-question" class="text-sm font-medium text-mystic-200">
                Your question
              </label>
              <div
                class="rounded-2xl bg-mystic-800/35 p-3 ring-1 ring-mystic-600/40 transition-shadow focus-within:ring-2 focus-within:ring-gold-500/60"
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
                class="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide sm:mx-0 sm:flex-nowrap sm:overflow-visible sm:px-0"
                role="group"
                aria-label="Example questions"
              >
                <button
                  v-for="prompt in promptSuggestions"
                  :key="prompt"
                  type="button"
                  class="inline-flex min-h-11 shrink-0 snap-start items-center whitespace-nowrap rounded-full border border-mystic-600/60 px-3.5 text-xs text-mystic-300 transition-colors duration-200 hover:border-gold-500/50 hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 active:scale-[0.98]"
                  @click="usePromptSuggestion(prompt)"
                >
                  {{ prompt }}
                </button>
              </div>
            </div>

            <div class="my-5 h-px bg-mystic-700/50" aria-hidden="true"></div>

            <div>
              <p class="font-display text-sm tracking-widest text-gold-300">Choose a spread</p>
              <div
                class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"
                role="group"
                aria-label="Select spread type"
                aria-describedby="spread-description"
              >
                <button
                  v-for="option in spreadOptions"
                  :key="option.value"
                  type="button"
                  class="group flex min-h-14 w-full cursor-pointer flex-col items-start justify-center gap-0.5 rounded-xl border px-4 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  :class="
                    spreadType === option.value
                      ? 'border-gold-300/70 bg-gold-500 text-mystic-900 shadow-lg shadow-gold-500/20'
                      : 'border-mystic-600/50 bg-mystic-800/50 text-mystic-200 hover:border-gold-500/40 hover:text-mystic-100'
                  "
                  :disabled="!isHydrated || isLoading"
                  :aria-pressed="spreadType === option.value"
                  @click="selectSpread(option.value)"
                >
                  <span>{{ option.label }}</span>
                  <span
                    aria-hidden="true"
                    class="text-[11px] font-normal"
                    :class="spreadType === option.value ? 'text-mystic-900/70' : 'text-mystic-400'"
                  >
                    {{ cardCountLabel(option.value) }}
                  </span>
                </button>
              </div>
              <p
                id="spread-description"
                class="mt-3 flex min-h-5 items-start gap-2 text-sm leading-relaxed text-mystic-300"
                aria-live="polite"
              >
                <span
                  class="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-gold-500"
                  aria-hidden="true"
                ></span>
                <span>{{ spreadDescription }}</span>
              </p>
            </div>

            <div class="mt-5 flex flex-col items-center gap-3 border-t border-mystic-700/50 pt-5">
              <UButton
                type="button"
                size="lg"
                color="primary"
                variant="solid"
                data-testid="draw-cards"
                :loading="isLoading"
                :disabled="!canDraw"
                aria-describedby="draw-hint"
                class="group min-h-12 w-full justify-center rounded-full border px-8 text-base font-semibold tracking-wide !border-gold-500 !bg-gold-500 !text-mystic-900 shadow-lg shadow-gold-500/20 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:!bg-gold-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-500/25 active:translate-y-0 active:scale-[0.98] disabled:!border-mystic-600 disabled:!bg-mystic-800 disabled:!text-mystic-200 disabled:!opacity-100 disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed sm:w-auto sm:min-w-64"
                @click="handleStartReading"
              >
                <template #leading>
                  <span
                    v-if="!isLoading"
                    class="transition-transform duration-300 group-hover:rotate-12"
                    aria-hidden="true"
                    >&#10022;</span
                  >
                </template>
                {{ isLoading ? 'Reading the cards...' : 'Draw cards' }}
                <template v-if="!isLoading && canDraw" #trailing>
                  <span
                    class="hidden rounded border border-mystic-900/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider opacity-70 sm:inline"
                    aria-hidden="true"
                  >
                    &#8984; / Ctrl &#8629;
                  </span>
                </template>
              </UButton>
              <p id="draw-hint" class="text-center text-xs text-mystic-300">
                <span v-if="!question.trim()">Write a question above to begin.</span>
                <span v-else>No account required. Save the reading whenever you are ready.</span>
              </p>
            </div>
          </div>
        </div>

        <p v-if="error" class="mt-4 text-center text-sm text-red-400" role="alert">
          {{ error }}
        </p>
      </section>

      <ReadingStage
        v-else
        key="reading"
        :question="question"
        :spread-type="spreadType"
        :spread-name="spreadName"
        :spread-description="spreadDescription"
        :cards="cards"
        :reading-text="readingText"
        :is-loading="isLoading"
        :is-streaming="isStreaming"
        :is-revealed="isRevealed"
        :is-replaying="isReplaying"
        :is-completed="isCompleted"
        :is-failed="isFailed"
        :error="error"
        :share-slug="shareSlug"
        :share-url="shareUrl"
        :reveal-timings-ms="revealTimingsMs"
        :is-sending-email="isSendingEmail"
        :share-message="shareMessage.message.value"
        :email-message="emailMessage.message.value"
        :email-error="emailError.message.value"
        @share="handleShare"
        @replay="handleReplay"
        @retry="handleStartReading"
        @new-reading="handleNewReading"
        @email-request="handleEmailRequest"
      />
    </Transition>

    <ClientOnly>
      <Teleport to="#header-actions">
        <button
          type="button"
          class="group inline-flex min-h-11 max-w-full items-center gap-2.5 rounded-full border border-mystic-600/60 bg-mystic-800/60 py-1 pl-1 pr-3 text-left transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-px hover:border-gold-500/45 hover:bg-mystic-700/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-mystic-900 active:translate-y-0 active:scale-[0.98] sm:pr-4"
          aria-controls="account-archive-panel"
          :aria-expanded="accountModalOpen"
          aria-label="Open reading archive"
          @click="openAccountModal"
        >
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-300 transition-colors duration-300 group-hover:bg-gold-500/20"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <path d="M4 8.5v10.25A1.25 1.25 0 0 0 5.25 20h13.5A1.25 1.25 0 0 0 20 18.75V8.5" />
              <path d="M3 8.5h18l-1.5-4h-15L3 8.5Z" />
              <path d="M9 12.5h6" />
            </svg>
          </span>
          <span class="min-w-0">
            <span class="block truncate text-xs font-medium text-mystic-100">
              {{ account ? account.displayName || 'Reading archive' : 'Save your readings' }}
            </span>
            <span class="hidden text-[11px] text-mystic-400 sm:block">
              <template v-if="account">
                {{ accountReadings.length }}
                {{ accountReadings.length === 1 ? 'saved reading' : 'saved readings' }}
              </template>
              <template v-else
                >Optional <span aria-hidden="true">&middot;</span> restore later</template
              >
            </span>
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="hidden size-4 shrink-0 text-mystic-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-gold-300 sm:block"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </Teleport>
    </ClientOnly>

    <UModal
      v-model:open="accountModalOpen"
      title="Your reading archive"
      description="Optional. Keep completed readings in this browser and restore them by email."
      scrollable
      :ui="{
        content: 'border border-gold-500/25 bg-mystic-900 shadow-2xl shadow-mystic-950/60',
        header: 'border-b border-mystic-700/50 px-4 py-4 sm:px-6',
        body: 'p-4 sm:p-6',
      }"
    >
      <template #body>
        <AccountPanel
          embedded
          :account="account"
          :readings="accountReadings"
          :is-loading="!isHydrated || isAccountLoading"
          :is-saving="isAccountSaving"
          :can-restore="canRestoreArchive"
          :message="accountMessage"
          :error="accountError"
          @save="handleAccountSave"
          @login-request="handleAccountLoginRequest"
          @login-verify="handleAccountLoginVerify"
          @logout="handleAccountLogout"
          @close="closeAccountModal"
        />
      </template>
    </UModal>
  </div>
</template>
