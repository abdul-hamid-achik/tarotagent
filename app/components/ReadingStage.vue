<script setup lang="ts">
import type { ReadingCard, SpreadType } from '~~/shared/tarot'

withDefaults(
  defineProps<{
    question: string
    spreadType: SpreadType
    spreadName: string
    spreadDescription: string
    cards: ReadingCard[]
    readingText: string
    isLoading: boolean
    isStreaming: boolean
    isRevealed: boolean
    isReplaying: boolean
    isCompleted: boolean
    isFailed: boolean
    error?: string | null
    shareSlug?: string | null
    shareUrl?: string | null
    revealTimingsMs?: number[]
    isSendingEmail?: boolean
    shareMessage?: string | null
    emailMessage?: string | null
    emailError?: string | null
  }>(),
  {
    error: null,
    shareSlug: null,
    shareUrl: null,
    revealTimingsMs: undefined,
    isSendingEmail: false,
    shareMessage: null,
    emailMessage: null,
    emailError: null,
  },
)

const emit = defineEmits<{
  share: []
  replay: []
  retry: []
  'new-reading': []
  'email-request': [email: string]
}>()
</script>

<template>
  <section class="flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-10">
    <ReadingMetaCard
      :spread-name="spreadName"
      :question="question"
      :spread-description="spreadDescription"
      :share-slug="shareSlug"
      :share-url="shareUrl"
    />

    <div
      v-if="isLoading && cards.length === 0"
      class="flex w-full flex-col items-center gap-6 py-8"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="deck" aria-hidden="true">
        <img
          v-for="n in 3"
          :key="n"
          src="/cards/back.png"
          alt=""
          class="deck-card"
          :class="`deck-card-${n}`"
        />
      </div>
      <p class="font-display text-sm tracking-[0.12em] text-mystic-300">Shuffling the deck...</p>
    </div>

    <TarotSpread
      v-else
      :cards="cards"
      :spread-type="spreadType"
      :revealed="isRevealed"
      :reveal-timings="revealTimingsMs"
    />

    <div class="flex w-full max-w-3xl flex-col gap-5">
      <ReadingDisplay :text="readingText" :is-streaming="isStreaming" :error="error" />

      <ReadingActions
        v-if="isCompleted"
        :share-url="shareUrl"
        :is-replaying="isReplaying"
        :is-sending-email="isSendingEmail"
        :share-message="shareMessage"
        :email-message="emailMessage"
        :email-error="emailError"
        @share="emit('share')"
        @replay="emit('replay')"
        @new-reading="emit('new-reading')"
        @email-request="(email) => emit('email-request', email)"
      />

      <div v-else-if="isFailed" class="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
        <UButton
          size="lg"
          class="col-span-2 h-11 justify-center px-5 sm:col-span-1"
          @click="emit('retry')"
          >Retry Reading</UButton
        >
        <UButton
          variant="outline"
          color="neutral"
          size="lg"
          class="h-11 justify-center px-5"
          @click="emit('new-reading')"
          >New Reading</UButton
        >
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Loading: three card backs fanning and settling, with a light sweep across the top card. */
.deck {
  position: relative;
  width: 7rem;
  height: 9.8rem;
}

.deck-card {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid rgba(212, 168, 83, 0.2);
  box-shadow: 0 16px 30px -18px rgba(7, 7, 25, 0.9);
  will-change: transform;
}

.deck-card-1 {
  transform: rotate(-7deg) translateX(-6px);
  animation: deck-fan-left 2.4s ease-in-out infinite alternate;
}

.deck-card-2 {
  transform: rotate(0deg);
  animation: deck-lift 2.4s ease-in-out infinite alternate;
}

.deck-card-3 {
  transform: rotate(6deg) translateX(6px);
  animation: deck-fan-right 2.4s ease-in-out infinite alternate;
}

@keyframes deck-fan-left {
  to {
    transform: rotate(-11deg) translateX(-14px);
  }
}

@keyframes deck-fan-right {
  to {
    transform: rotate(10deg) translateX(14px);
  }
}

@keyframes deck-lift {
  to {
    transform: translateY(-6px);
  }
}

.deck::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0.5rem;
  pointer-events: none;
  background: linear-gradient(
    115deg,
    transparent 35%,
    rgba(233, 196, 106, 0.22) 50%,
    transparent 65%
  );
  transform: translateX(-100%);
  animation: deck-sheen 2.8s ease-in-out infinite;
}

@keyframes deck-sheen {
  0%,
  35% {
    transform: translateX(-100%);
  }
  75%,
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .deck-card,
  .deck::after {
    animation: none;
  }
}
</style>
