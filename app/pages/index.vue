<script setup lang="ts">
import type { SpreadType } from '~~/shared/tarot'
import type { ClientConfig } from '~~/shared/config'
import { spreadOptions } from '~~/shared/readings'
import { useReadingAnalytics } from '~/composables/useReadingAnalytics'

useSeoMeta({
  title: 'Tarot Agent — Free AI Tarot Readings Online',
  description:
    'Get a free AI-powered tarot reading. Choose from Single Card, Yes/No, Three Card, Love, Career, or Celtic Cross spreads with a full 78-card deck and streaming interpretations by Claude AI.',
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
const hasReading = computed(() => cards.value.length > 0)
const canDraw = computed(
  () => isHydrated.value && question.value.trim().length > 0 && !isLoading.value,
)
const isCompleted = computed(
  () => readingStatus.value === 'completed' && finalText.value.length > 0,
)
const isFailed = computed(() => readingStatus.value === 'failed')

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
    emailError.set(
      caughtError instanceof Error
        ? caughtError.message
        : 'Unable to email this reading right now.',
    )
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

    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
      mode="out-in"
    >
      <section v-if="!hasReading" key="input" class="w-full max-w-lg flex flex-col gap-6">
        <UTextarea
          v-model="question"
          placeholder="What wisdom do you seek?"
          :rows="3"
          autoresize
          size="lg"
          class="w-full"
          :disabled="!isHydrated || isLoading"
          aria-label="Your tarot question"
        />

        <div class="rounded-xl border border-mystic-600/30 bg-mystic-800/40 p-4 sm:p-5">
          <div class="flex flex-col items-center gap-4">
            <div class="flex flex-col items-center gap-2">
              <span class="text-xs text-mystic-400 font-display uppercase tracking-widest">
                Spread
              </span>
              <div
                class="flex flex-wrap justify-center gap-2 w-full"
                role="group"
                aria-label="Select spread type"
              >
                <button
                  v-for="option in spreadOptions"
                  :key="option.value"
                  class="cursor-pointer min-h-11 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  :class="
                    spreadType === option.value
                      ? 'bg-gold-500 text-mystic-900 shadow-lg shadow-gold-500/25 scale-105'
                      : 'bg-mystic-700/50 text-mystic-300 hover:bg-mystic-600/50 hover:text-mystic-100 active:scale-95'
                  "
                  :disabled="!isHydrated || isLoading"
                  :aria-pressed="spreadType === option.value"
                  @click="selectSpread(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="text-center max-w-sm">
              <p class="font-display text-gold-300 text-sm">
                {{ spreadName }}
              </p>
              <p class="text-sm text-mystic-300 mt-1">
                {{ spreadDescription }}
              </p>
            </div>

            <UButton
              size="lg"
              :loading="isLoading"
              :disabled="!canDraw"
              class="mt-2 px-8"
              @click="handleStartReading"
            >
              <template #leading>
                <span v-if="!isLoading" aria-hidden="true">&#10022;</span>
              </template>
              Draw Cards
            </UButton>
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
  </div>
</template>
