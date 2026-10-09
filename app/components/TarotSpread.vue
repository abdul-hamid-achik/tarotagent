<script setup lang="ts">
import { computed } from 'vue'
import type { ReadingCard, SpreadType } from '../../shared/tarot'
import { getSpreadRevealTimings, spreadDefinitions } from '../../shared/tarot'
import TarotCard from './TarotCard.vue'

const props = withDefaults(
  defineProps<{
    cards: ReadingCard[]
    spreadType: SpreadType
    revealed: boolean
    revealTimings?: number[]
    instantReveal?: boolean
  }>(),
  {
    revealTimings: undefined,
    instantReveal: false,
  },
)

const resolvedRevealTimings = computed(
  () => props.revealTimings ?? getSpreadRevealTimings(props.spreadType),
)

// Celtic Cross: cards 0-5 form the cross, 6-9 the staff.
const celticCrossLeadCards = computed(() => props.cards.slice(0, 6))
const celticCrossStaffCards = computed(() => props.cards.slice(6, 10))

const isSingleLayout = (type: SpreadType) => type === 'single' || type === 'yes-no'
const isRowLayout = (type: SpreadType) =>
  type === 'three-card' || type === 'love' || type === 'career'

// Row spreads share the reading column width (max-w-3xl) so the page reads as one column.
const rowLayoutClasses = computed(() =>
  props.spreadType === 'three-card'
    ? 'grid-cols-3 gap-x-6 sm:gap-x-8'
    : 'grid-cols-2 gap-x-3 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-4',
)

function delayFor(index: number) {
  return resolvedRevealTimings.value[index] ?? 0
}

function positionLabel(index: number) {
  return props.cards[index]?.position ?? spreadDefinitions[props.spreadType].positions[index] ?? ''
}

// Every position label sits above its card, with a reserved two-line height.
const labelClasses =
  'flex min-h-8 w-24 items-end justify-center text-center text-[10px] leading-tight text-mystic-400 font-display uppercase tracking-widest sm:w-28 sm:text-xs'
</script>

<template>
  <div v-if="isSingleLayout(spreadType)" class="flex w-full max-w-xl justify-center">
    <div
      v-for="card in cards.slice(0, 1)"
      :key="`${card.id}-${card.position}`"
      class="flex flex-col items-center gap-1"
    >
      <p class="mb-2 text-xs text-mystic-400 font-display uppercase tracking-widest">
        {{ card.position }}
      </p>
      <TarotCard
        :card="card"
        :revealed="revealed"
        :delay="delayFor(0)"
        :instant-reveal="instantReveal"
      />
    </div>
  </div>

  <div
    v-else-if="isRowLayout(spreadType)"
    class="grid w-full max-w-3xl place-items-start gap-y-8 sm:gap-y-10"
    :class="rowLayoutClasses"
  >
    <div
      v-for="(card, index) in cards"
      :key="`${card.id}-${card.position}`"
      class="flex min-w-0 flex-col items-center gap-1 justify-self-center"
    >
      <p :class="labelClasses" class="mb-2 w-full max-w-[9rem]">
        {{ card.position }}
      </p>
      <TarotCard
        :card="card"
        :revealed="revealed"
        :delay="delayFor(index)"
        :instant-reveal="instantReveal"
        size="row"
      />
    </div>
  </div>

  <div
    v-else
    class="flex w-full max-w-3xl flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-16"
  >
    <!-- The cross: a 3x3 grid. Crown above; Recent Past, Present and Near Future across;
         Foundation below. Challenge crosses Present, offset downward so Present's art
         stays visible. Both centre cards are captioned underneath, not on the cards. -->
    <div
      class="grid shrink-0 grid-cols-3 items-start justify-items-center gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-6"
      role="group"
      aria-label="Celtic Cross, the cross"
    >
      <div class="col-start-2 row-start-1 flex flex-col items-center gap-1">
        <p :class="labelClasses">
          {{ positionLabel(4) }}
        </p>
        <TarotCard
          v-if="celticCrossLeadCards[4]"
          :card="celticCrossLeadCards[4]"
          :revealed="revealed"
          :delay="delayFor(4)"
          :instant-reveal="instantReveal"
          size="compact"
        />
      </div>

      <div class="col-start-1 row-start-2 flex flex-col items-center gap-1">
        <p :class="labelClasses">
          {{ positionLabel(3) }}
        </p>
        <TarotCard
          v-if="celticCrossLeadCards[3]"
          :card="celticCrossLeadCards[3]"
          :revealed="revealed"
          :delay="delayFor(3)"
          :instant-reveal="instantReveal"
          size="compact"
        />
      </div>

      <!-- Padded so the rotated Challenge card (wider than a column) doesn't overlap neighbours. -->
      <div class="col-start-2 row-start-2 flex flex-col items-center gap-1 px-5 sm:px-7">
        <p :class="labelClasses">{{ positionLabel(0) }} &amp; {{ positionLabel(1) }}</p>
        <div class="relative">
          <TarotCard
            v-if="celticCrossLeadCards[0]"
            :card="celticCrossLeadCards[0]"
            :revealed="revealed"
            :delay="delayFor(0)"
            :instant-reveal="instantReveal"
            size="compact"
            :show-label="false"
          />
          <!-- 14% lands the rotated card's lower edge on Present's lower edge, leaving the
               top of Present visible without spilling onto the captions. -->
          <div
            v-if="celticCrossLeadCards[1]"
            class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <div class="translate-y-[14%] rotate-90">
              <TarotCard
                :card="celticCrossLeadCards[1]"
                :revealed="revealed"
                :delay="delayFor(1)"
                :instant-reveal="instantReveal"
                size="compact"
                :show-label="false"
              />
            </div>
          </div>
        </div>
        <div
          class="mt-2 flex max-w-[11rem] flex-col items-center gap-1 text-center transition-opacity duration-500"
          :class="revealed ? 'opacity-100' : 'opacity-0'"
        >
          <p class="text-[11px] leading-snug text-mystic-100">
            <span class="font-display uppercase tracking-widest text-mystic-400">{{
              positionLabel(0)
            }}</span>
            <span class="font-display font-semibold"> · {{ cards[0]?.name }}</span>
          </p>
          <p class="text-[11px] leading-snug text-mystic-100">
            <span class="font-display uppercase tracking-widest text-mystic-400">{{
              positionLabel(1)
            }}</span>
            <span class="font-display font-semibold"> · {{ cards[1]?.name }}</span>
            <span v-if="cards[1]?.reversed" class="text-mystic-400"> · Reversed</span>
          </p>
        </div>
      </div>

      <div class="col-start-3 row-start-2 flex flex-col items-center gap-1">
        <p :class="labelClasses">
          {{ positionLabel(5) }}
        </p>
        <TarotCard
          v-if="celticCrossLeadCards[5]"
          :card="celticCrossLeadCards[5]"
          :revealed="revealed"
          :delay="delayFor(5)"
          :instant-reveal="instantReveal"
          size="compact"
        />
      </div>

      <div class="col-start-2 row-start-3 flex flex-col items-center gap-1">
        <p :class="labelClasses">
          {{ positionLabel(2) }}
        </p>
        <TarotCard
          v-if="celticCrossLeadCards[2]"
          :card="celticCrossLeadCards[2]"
          :revealed="revealed"
          :delay="delayFor(2)"
          :instant-reveal="instantReveal"
          size="compact"
        />
      </div>
    </div>

    <!-- The staff: four cards in a column on desktop, a 2x2 grid on mobile.
         Labels sit above each card, as they do on the cross. -->
    <div
      class="grid w-full max-w-xs grid-cols-2 gap-x-4 gap-y-8 sm:flex sm:w-auto sm:max-w-none sm:flex-col sm:gap-5"
      role="group"
      aria-label="Celtic Cross, the staff"
    >
      <div
        v-for="(card, index) in celticCrossStaffCards"
        :key="`${card.id}-${card.position}`"
        class="flex min-w-0 flex-col items-center gap-1"
      >
        <p :class="labelClasses">
          {{ card.position }}
        </p>
        <TarotCard
          :card="card"
          :revealed="revealed"
          :delay="delayFor(index + 6)"
          :instant-reveal="instantReveal"
          size="mini"
        />
      </div>
    </div>
  </div>
</template>
