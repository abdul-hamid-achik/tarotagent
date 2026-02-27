<script setup lang="ts">
import type { DrawnCard } from '~/types/tarot'

defineProps<{
  cards: DrawnCard[]
  spreadType: string
  revealed: boolean
}>()

const isSingleLayout = (type: string) => type === 'single' || type === 'yes-no'
const isRowLayout = (type: string) =>
  type === 'three-card' || type === 'love' || type === 'career'
</script>

<template>
  <!-- Single / Yes-No (1 card, centered) -->
  <div v-if="isSingleLayout(spreadType)" class="flex justify-center">
    <div
      v-for="card in cards.slice(0, 1)"
      :key="card.id"
      class="flex flex-col items-center gap-1"
    >
      <p
        class="text-xs text-mystic-400 font-[family-name:var(--font-family-display)] uppercase tracking-widest mb-2"
      >
        {{ card.position }}
      </p>
      <TarotCard :card="card" :revealed="revealed" :delay="200" />
    </div>
  </div>

  <!-- Row spreads: Three Card / Love / Career -->
  <div
    v-else-if="isRowLayout(spreadType)"
    class="flex justify-center items-start gap-3 sm:gap-6 flex-wrap"
  >
    <div
      v-for="(card, i) in cards"
      :key="card.id"
      class="flex flex-col items-center gap-1"
    >
      <p
        class="text-xs text-mystic-400 font-[family-name:var(--font-family-display)] uppercase tracking-widest mb-2 text-center max-w-[8rem]"
      >
        {{ card.position }}
      </p>
      <TarotCard :card="card" :revealed="revealed" :delay="200 + i * 200" />
    </div>
  </div>

  <!-- Celtic Cross -->
  <div v-else-if="spreadType === 'celtic-cross'" class="flex flex-col items-center gap-6">
    <!-- Cross section (cards 1-6) -->
    <div class="relative w-[320px] h-[340px] sm:w-[420px] sm:h-[400px]">
      <!-- Card 1: Present (center) -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="flex flex-col items-center gap-1">
          <p
            class="text-[10px] text-mystic-400 font-[family-name:var(--font-family-display)] uppercase tracking-widest"
          >
            Present
          </p>
          <TarotCard v-if="cards[0]" :card="cards[0]" :revealed="revealed" :delay="200" />
        </div>
      </div>

      <!-- Card 2: Challenge (crossing, rotated) -->
      <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 z-10 pointer-events-none"
      >
        <TarotCard v-if="cards[1]" :card="cards[1]" :revealed="revealed" :delay="400" />
      </div>

      <!-- Card 3: Foundation (below) -->
      <div class="absolute left-1/2 bottom-0 -translate-x-1/2">
        <div class="flex flex-col items-center gap-1">
          <p
            class="text-[10px] text-mystic-400 font-[family-name:var(--font-family-display)] uppercase tracking-widest"
          >
            Foundation
          </p>
          <TarotCard v-if="cards[2]" :card="cards[2]" :revealed="revealed" :delay="600" />
        </div>
      </div>

      <!-- Card 4: Recent Past (left) -->
      <div class="absolute left-0 top-1/2 -translate-y-1/2">
        <div class="flex flex-col items-center gap-1">
          <p
            class="text-[10px] text-mystic-400 font-[family-name:var(--font-family-display)] uppercase tracking-widest"
          >
            Recent Past
          </p>
          <TarotCard v-if="cards[3]" :card="cards[3]" :revealed="revealed" :delay="800" />
        </div>
      </div>

      <!-- Card 5: Crown (above) -->
      <div class="absolute left-1/2 top-0 -translate-x-1/2">
        <div class="flex flex-col items-center gap-1">
          <p
            class="text-[10px] text-mystic-400 font-[family-name:var(--font-family-display)] uppercase tracking-widest"
          >
            Crown
          </p>
          <TarotCard v-if="cards[4]" :card="cards[4]" :revealed="revealed" :delay="1000" />
        </div>
      </div>

      <!-- Card 6: Near Future (right) -->
      <div class="absolute right-0 top-1/2 -translate-y-1/2">
        <div class="flex flex-col items-center gap-1">
          <p
            class="text-[10px] text-mystic-400 font-[family-name:var(--font-family-display)] uppercase tracking-widest"
          >
            Near Future
          </p>
          <TarotCard v-if="cards[5]" :card="cards[5]" :revealed="revealed" :delay="1200" />
        </div>
      </div>
    </div>

    <!-- Staff section (cards 7-10) -->
    <div class="flex gap-4 sm:gap-6 flex-wrap justify-center">
      <div
        v-for="(card, i) in cards.slice(6, 10)"
        :key="card.id"
        class="flex flex-col items-center gap-1"
      >
        <p
          class="text-[10px] text-mystic-400 font-[family-name:var(--font-family-display)] uppercase tracking-widest"
        >
          {{ card.position }}
        </p>
        <TarotCard :card="card" :revealed="revealed" :delay="1400 + i * 200" />
      </div>
    </div>
  </div>
</template>
