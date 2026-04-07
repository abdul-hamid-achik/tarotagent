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
  <div class="flex flex-col items-center gap-6 sm:gap-10">
    <div class="grain-overlay"></div>

    <section class="text-center pt-6 pb-2 sm:pt-8 sm:pb-4">
      <div class="animate-float inline-block mb-6">
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gold-500/20 to-mystic-500/20 border border-gold-500/30 flex items-center justify-center shadow-lg shadow-gold-500/10"
        >
          <span class="text-4xl sm:text-5xl text-gold-400">&#9734;</span>
        </div>
      </div>
      <h2
        class="font-[family-name:var(--font-family-display)] text-3xl sm:text-4xl font-semibold text-mystic-100 mb-3 tracking-wide"
      >
        Consult the Cards
      </h2>
      <p class="text-mystic-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
        An AI-powered tarot reading experience. Focus your mind, ask your question, and let the
        cards reveal their wisdom.
      </p>
    </section>

    <section v-if="!hasReading" class="w-full max-w-lg flex flex-col gap-6">
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
          <span
            class="text-xs text-mystic-400 font-[family-name:var(--font-family-display)] uppercase tracking-widest"
          >
            Spread
          </span>
          <div
            class="flex gap-2 overflow-x-auto pb-2 px-1 -mx-1 scrollbar-hide w-[calc(100%+8px)] sm:w-auto sm:overflow-visible justify-center"
          >
            <button
              v-for="option in spreadOptions"
              :key="option.value"
              class="cursor-pointer px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap"
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

      <p v-if="error" class="text-red-400 text-sm text-center">
        {{ error }}
      </p>
    </section>

    <template v-if="hasReading">
      <section class="w-full flex flex-col items-center gap-8 sm:gap-10">
        <TarotSpread :cards="cards" :spread-type="spreadType" :revealed="isRevealed" />

        <div class="w-full max-w-2xl">
          <ReadingDisplay :text="readingText" :is-streaming="isStreaming" />
        </div>

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
