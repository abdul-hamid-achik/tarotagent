<script setup lang="ts">
import type { ReadingCard } from '~~/shared/tarot'
import TarotSpread from '../app/components/TarotSpread.vue'

const cards: ReadingCard[] = [
  {
    id: 0,
    name: 'The Fool',
    numeral: '0',
    image: '/cards/00-the-fool.png',
    reversed: false,
    position: 'Past',
  },
  {
    id: 6,
    name: 'The Lovers',
    numeral: 'VI',
    image: '/cards/06-the-lovers.png',
    reversed: true,
    position: 'Present',
  },
  {
    id: 19,
    name: 'The Sun',
    numeral: 'XIX',
    image: '/cards/19-the-sun.png',
    reversed: false,
    position: 'Future',
  },
]
</script>

<template>
  <Story title="Spreads / Tarot spread" :layout="{ type: 'single', iframe: true }">
    <Variant title="Three-card reveal">
      <TarotSpread
        :cards="cards"
        spread-type="three-card"
        :revealed="true"
        :reveal-timings="[0, 0, 0]"
        instant-reveal
      />
    </Variant>

    <Variant title="Three-card draw">
      <TarotSpread :cards="cards" spread-type="three-card" :revealed="false" />
    </Variant>
  </Story>
</template>
