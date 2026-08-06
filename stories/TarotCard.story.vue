<script setup lang="ts">
import type { ReadingCard } from '~~/shared/tarot'
import TarotCard from '../app/components/TarotCard.vue'

const uprightCard: ReadingCard = {
  id: 17,
  name: 'The Star',
  numeral: 'XVII',
  image: '/cards/17-the-star.png',
  reversed: false,
  position: 'Guidance',
}

const reversedCard: ReadingCard = {
  ...uprightCard,
  reversed: true,
  position: 'Challenge',
}
</script>

<template>
  <Story title="Cards / Tarot card" :layout="{ type: 'grid', width: 280 }">
    <Variant title="Face down">
      <TarotCard :card="uprightCard" />
    </Variant>

    <Variant title="Revealed upright">
      <TarotCard :card="uprightCard" revealed instant-reveal />
    </Variant>

    <Variant title="Revealed reversed">
      <TarotCard :card="reversedCard" revealed instant-reveal />
    </Variant>
  </Story>
</template>
