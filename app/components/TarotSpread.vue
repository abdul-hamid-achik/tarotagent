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

const celticCrossLeadCards = computed(() => props.cards.slice(0, 6))
const celticCrossStaffCards = computed(() => props.cards.slice(6, 10))

const isSingleLayout = (type: SpreadType) => type === 'single' || type === 'yes-no'
const isRowLayout = (type: SpreadType) =>
  type === 'three-card' || type === 'love' || type === 'career'

const rowLayoutClasses = computed(() =>
  props.spreadType === 'three-card'
    ? 'grid-cols-3 gap-x-2 sm:gap-x-6'
    : 'grid-cols-2 gap-x-2 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5 lg:gap-x-4',
)

function delayFor(index: number) {
  return resolvedRevealTimings.value[index] ?? 0
}

function positionLabel(index: number) {
  return props.cards[index]?.position ?? spreadDefinitions[props.spreadType].positions[index] ?? ''
}

const celticPositionLabelClasses =
  'flex min-h-8 w-full max-w-[9rem] items-end justify-center text-center text-[10px] leading-tight text-mystic-400 font-display uppercase tracking-widest sm:min-h-10 sm:text-xs'
</script>

<template>
  <div v-if="isSingleLayout(spreadType)" class="flex w-full max-w-xl justify-center">
    <div
      v-for="card in cards.slice(0, 1)"
      :key="`${card.id}-${card.position}`"
      class="flex flex-col items-center gap-1"
    >
      <p class="text-xs text-mystic-400 font-display uppercase tracking-widest mb-2">
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
    class="grid w-full max-w-5xl place-items-start gap-y-8 sm:gap-y-10"
    :class="rowLayoutClasses"
  >
    <div
      v-for="(card, index) in cards"
      :key="`${card.id}-${card.position}`"
      class="flex min-w-0 flex-col items-center gap-1"
    >
      <p
        class="mb-2 flex min-h-8 w-full max-w-[9rem] items-end justify-center text-center text-xs leading-tight text-mystic-400 font-display uppercase tracking-widest sm:min-h-10"
      >
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

  <div v-else class="flex w-full max-w-5xl flex-col items-center gap-6 sm:gap-8">
    <div
      class="w-full overflow-x-auto pb-2 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-4 focus:ring-offset-mystic-900"
      tabindex="0"
      role="group"
      aria-label="Celtic Cross spread. Scroll horizontally on smaller screens."
    >
      <div
        class="mx-auto grid min-w-[30rem] max-w-[44rem] grid-cols-[8rem_12rem_8rem] items-center justify-center gap-x-6 gap-y-8 sm:min-w-0 sm:grid-cols-[8rem_13rem_8rem] sm:gap-x-12 sm:gap-y-10"
      >
        <div class="col-start-2 row-start-1 flex flex-col items-center gap-1">
          <p :class="celticPositionLabelClasses">
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
          <p :class="celticPositionLabelClasses">
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

        <div class="col-start-2 row-start-2 flex flex-col items-center gap-1">
          <p :class="celticPositionLabelClasses">
            {{ positionLabel(0) }}
          </p>
          <div class="relative flex min-h-[8rem] min-w-[12rem] items-center justify-center">
            <TarotCard
              v-if="celticCrossLeadCards[0]"
              :card="celticCrossLeadCards[0]"
              :revealed="revealed"
              :delay="delayFor(0)"
              :instant-reveal="instantReveal"
              size="compact"
            />
            <div
              class="pointer-events-none absolute left-1/2 top-[4.25rem] z-10 -translate-x-1/2 -translate-y-1/2 rotate-90 sm:top-[5.625rem]"
            >
              <TarotCard
                v-if="celticCrossLeadCards[1]"
                :card="celticCrossLeadCards[1]"
                :revealed="revealed"
                :delay="delayFor(1)"
                :instant-reveal="instantReveal"
                size="compact"
                :show-label="false"
              />
            </div>
          </div>
          <p
            class="relative z-20 rounded-full border border-mystic-700/60 bg-mystic-950/70 px-2 py-0.5 text-[10px] text-mystic-300"
          >
            {{ positionLabel(1) }}
          </p>
        </div>

        <div class="col-start-3 row-start-2 flex flex-col items-center gap-1">
          <p :class="celticPositionLabelClasses">
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
          <p :class="celticPositionLabelClasses">
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
    </div>

    <div class="grid w-full max-w-4xl grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 sm:gap-x-6">
      <div
        v-for="(card, index) in celticCrossStaffCards"
        :key="`${card.id}-${card.position}`"
        class="flex min-w-0 flex-col items-center gap-1"
      >
        <p :class="celticPositionLabelClasses">
          {{ card.position }}
        </p>
        <TarotCard
          :card="card"
          :revealed="revealed"
          :delay="delayFor(index + 6)"
          :instant-reveal="instantReveal"
          size="compact"
        />
      </div>
    </div>
  </div>
</template>
