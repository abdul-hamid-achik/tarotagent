<script setup lang="ts">
defineProps<{
  text: string
  isStreaming: boolean
}>()
</script>

<template>
  <div
    v-if="text || isStreaming"
    class="rounded-xl border border-mystic-700/50 bg-mystic-800/60 backdrop-blur-sm p-6 sm:p-8"
  >
    <h3 class="font-[family-name:var(--font-family-display)] text-gold-400 text-lg mb-4">
      Your Reading
    </h3>
    <div class="text-mystic-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
      {{ text }}<span
        v-if="isStreaming"
        class="inline-flex ml-1"
      ><span class="animate-pulse text-gold-500">...</span></span>
    </div>
  </div>
</template>
