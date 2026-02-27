<script setup lang="ts">
import type { SpreadType } from '~/types/tarot'

useSeoMeta({
  title: 'Tarot Agent — Free AI Tarot Readings Online',
  description:
    'Get a free AI-powered tarot reading. Choose from Single Card, Yes/No, Three Card, Love, Career, or Celtic Cross spreads. Beautiful pixel-art Major Arcana with streaming interpretations by Claude AI.',
})

const {
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
} = useTarotReading()

const hasReading = computed(() => cards.value.length > 0)
const canDraw = computed(() => question.value.trim().length > 0 && !isLoading.value)

const spreadOptions = [
  { label: 'Single', value: 'single' as SpreadType },
  { label: 'Yes/No', value: 'yes-no' as SpreadType },
  { label: 'Three Card', value: 'three-card' as SpreadType },
  { label: 'Love', value: 'love' as SpreadType },
  { label: 'Career', value: 'career' as SpreadType },
  { label: 'Celtic Cross', value: 'celtic-cross' as SpreadType },
]

function handleNewReading() {
  reset()
}
</script>

<template>
  <div class="flex flex-col items-center gap-10">
    <!-- Hero section -->
    <section class="text-center pt-8 pb-4">
      <div class="animate-float inline-block mb-6">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500/20 to-mystic-500/20 border border-gold-500/30 flex items-center justify-center">
          <span class="text-3xl text-gold-400">&#9734;</span>
        </div>
      </div>
      <h2 class="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-semibold text-mystic-100 mb-3">
        Consult the Cards
      </h2>
      <p class="text-mystic-300 max-w-md mx-auto text-sm sm:text-base">
        An AI-powered tarot reading experience. Focus your mind, ask your question, and let the cards reveal their wisdom.
      </p>
    </section>

    <!-- Input section (hidden once reading is active) -->
    <section
      v-if="!hasReading"
      class="w-full max-w-lg flex flex-col gap-6"
    >
      <UTextarea
        v-model="question"
        placeholder="What wisdom do you seek?"
        :rows="3"
        autoresize
        size="lg"
        class="w-full"
      />

      <div class="flex flex-col items-center gap-4">
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs text-mystic-400 font-[family-name:var(--font-family-display)] uppercase tracking-widest">
            Spread
          </span>
          <div class="flex gap-2">
            <button
              v-for="option in spreadOptions"
              :key="option.value"
              class="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="
                spreadType === option.value
                  ? 'bg-gold-500 text-mystic-900 shadow-lg shadow-gold-500/25 scale-105'
                  : 'bg-mystic-700/50 text-mystic-300 hover:bg-mystic-600/50 hover:text-mystic-100 active:scale-95'
              "
              @click="spreadType = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <UButton
          size="lg"
          :loading="isLoading"
          :disabled="!canDraw"
          class="mt-2 px-8"
          @click="startReading"
        >
          <template #leading>
            <span v-if="!isLoading">&#10022;</span>
          </template>
          Draw Cards
        </UButton>
      </div>

      <p
        v-if="error"
        class="text-red-400 text-sm text-center"
      >
        {{ error }}
      </p>
    </section>

    <!-- Reading section -->
    <template v-if="hasReading">
      <section class="w-full flex flex-col items-center gap-10">
        <!-- Spread display -->
        <TarotSpread
          :cards="cards"
          :spread-type="spreadType"
          :revealed="isRevealed"
        />

        <!-- Reading text -->
        <div class="w-full max-w-2xl">
          <ReadingDisplay
            :text="readingText"
            :is-streaming="isStreaming"
          />
        </div>

        <!-- New reading button -->
        <UButton
          v-if="!isStreaming && readingText"
          variant="outline"
          size="lg"
          class="px-8"
          @click="handleNewReading"
        >
          New Reading
        </UButton>
      </section>
    </template>
  </div>
</template>
