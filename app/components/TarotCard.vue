<script setup lang="ts">
import type { ReadingCard } from '~~/shared/tarot'

const props = withDefaults(
  defineProps<{
    card: ReadingCard
    revealed?: boolean
    delay?: number
    instantReveal?: boolean
    size?: 'default' | 'compact'
  }>(),
  {
    revealed: false,
    delay: 0,
    instantReveal: false,
    size: 'default',
  },
)

const cardSizeClasses = computed(() =>
  props.size === 'compact' ? 'w-24 aspect-[32/45] sm:w-32' : 'w-32 aspect-[32/45] sm:w-40',
)

const labelSizeClasses = computed(() =>
  props.size === 'compact' ? 'text-xs sm:text-sm' : 'text-sm',
)

const flipped = ref(false)
let timeout: ReturnType<typeof setTimeout> | null = null

watch(
  () => [props.revealed, props.delay, props.instantReveal],
  ([revealed]) => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    if (revealed) {
      if (props.instantReveal || props.delay <= 0) {
        flipped.value = true
        return
      }

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
  <div
    class="flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-105 active:scale-[0.98]"
    :aria-label="
      flipped ? `${card.name}${card.reversed ? ', reversed' : ''}` : 'Face-down tarot card'
    "
  >
    <div
      class="card-flip transition-all duration-300"
      :class="[
        cardSizeClasses,
        {
          'animate-glow rounded-lg': flipped,
          'hover:shadow-xl hover:shadow-gold-500/10': !flipped,
        },
      ]"
    >
      <div class="card-flip-inner relative w-full h-full" :class="{ flipped }">
        <div
          class="card-face card-back card-back-mystic rounded-lg overflow-hidden shadow-lg shadow-mystic-900/80"
          aria-hidden="true"
        >
          <img src="/cards/back.png" alt="" loading="lazy" class="w-full h-full object-cover" />
        </div>

        <div
          class="card-face card-front rounded-lg overflow-hidden shadow-lg shadow-mystic-900/80 bg-mystic-800"
        >
          <img
            :src="card.image"
            :alt="card.name"
            loading="lazy"
            class="w-full h-full object-cover"
            :class="{ 'rotate-180': card.reversed }"
          />
        </div>
      </div>
    </div>

    <div
      class="text-center transition-opacity duration-500"
      :class="[flipped ? 'opacity-100' : 'opacity-0', labelSizeClasses]"
      :aria-hidden="!flipped"
    >
      <p class="font-display text-gold-400">
        {{ card.numeral }}
      </p>
      <p class="font-display text-mystic-100 font-semibold">
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
