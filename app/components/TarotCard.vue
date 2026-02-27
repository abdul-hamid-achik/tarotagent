<script setup lang="ts">
import type { DrawnCard } from '~/types/tarot'

const props = withDefaults(
  defineProps<{
    card: DrawnCard
    revealed?: boolean
    delay?: number
  }>(),
  {
    revealed: false,
    delay: 0,
  },
)

const flipped = ref(false)
let timeout: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.revealed,
  (val) => {
    if (val) {
      timeout = setTimeout(() => {
        flipped.value = true
      }, props.delay)
    } else {
      flipped.value = false
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div
      class="card-flip w-32 h-48 sm:w-40 sm:h-60"
      :class="{ 'animate-glow rounded-lg': flipped }"
    >
      <div
        class="card-flip-inner relative w-full h-full"
        :class="{ flipped }"
      >
        <!-- Back face -->
        <div class="card-face card-back rounded-lg overflow-hidden shadow-lg shadow-mystic-900/80">
          <img
            src="/cards/back.png"
            alt="Card back"
            class="w-full h-full object-cover"
          >
        </div>

        <!-- Front face -->
        <div class="card-face card-front rounded-lg overflow-hidden shadow-lg shadow-mystic-900/80 bg-mystic-800">
          <img
            :src="card.image"
            :alt="card.name"
            class="w-full h-full object-cover"
            :class="{ 'rotate-180': card.reversed }"
          >
        </div>
      </div>
    </div>

    <!-- Card info -->
    <div
      class="text-center transition-opacity duration-500"
      :class="flipped ? 'opacity-100' : 'opacity-0'"
    >
      <p class="font-[family-name:var(--font-family-display)] text-sm text-gold-400">
        {{ card.numeral }}
      </p>
      <p class="font-[family-name:var(--font-family-display)] text-sm text-mystic-100 font-semibold">
        {{ card.name }}
      </p>
      <UBadge
        v-if="card.reversed && flipped"
        color="neutral"
        variant="subtle"
        size="xs"
        class="mt-1"
      >
        Reversed
      </UBadge>
    </div>
  </div>
</template>
