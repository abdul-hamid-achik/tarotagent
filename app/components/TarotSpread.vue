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

function delayFor(index: number) {
  return resolvedRevealTimings.value[index] ?? 0
}

function positionLabel(index: number) {
  return props.cards[index]?.position ?? spreadDefinitions[props.spreadType].positions[index] ?? ''
}

const celticPositionLabelClasses =
  'text-[10px] sm:text-xs text-mystic-400 font-display uppercase tracking-widest text-center max-w-[9rem] leading-tight'
</script>

<template>
  <div v-if="isSingleLayout(spreadType)" class="flex justify-center">
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
    class="flex justify-center items-start gap-3 sm:gap-6 flex-wrap"
  >
    <div
      v-for="(card, index) in cards"
      :key="`${card.id}-${card.position}`"
      class="flex flex-col items-center gap-1"
    >
      <p
        class="text-xs text-mystic-400 font-display uppercase tracking-widest mb-2 text-center max-w-[8rem]"
      >
        {{ card.position }}
      </p>
      <TarotCard
        :card="card"
        :revealed="revealed"
        :delay="delayFor(index)"
        :instant-reveal="instantReveal"
      />
    </div>
  </div>

  <div v-else class="flex flex-col items-center gap-6 sm:gap-8 w-full">
    <div class="w-full overflow-x-auto pb-2">
      <div
        class="mx-auto grid min-w-[34rem] max-w-[44rem] grid-cols-[8rem_12rem_8rem] items-center justify-center gap-x-8 gap-y-8 sm:min-w-0 sm:grid-cols-[8rem_13rem_8rem] sm:gap-x-12 sm:gap-y-10"
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

    <div class="flex gap-3 sm:gap-6 flex-wrap justify-center">
      <div
        v-for="(card, index) in celticCrossStaffCards"
        :key="`${card.id}-${card.position}`"
        class="flex flex-col items-center gap-1"
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
