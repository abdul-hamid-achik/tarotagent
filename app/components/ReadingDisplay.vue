<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    isStreaming: boolean
    error?: string | null
    heading?: string
  }>(),
  {
    error: null,
    heading: 'Your Reading',
  },
)
</script>

<template>
  <div
    v-if="text || isStreaming || error"
    class="relative rounded-xl border border-mystic-600/30 bg-mystic-800/60 backdrop-blur-sm p-5 sm:p-8 reading-container"
  >
    <div
      class="absolute inset-0 rounded-xl opacity-5 pointer-events-none bg-gradient-to-br from-gold-500/20 via-transparent to-mystic-500/20"
    ></div>

    <div
      class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-gold-500/30 rounded-tl-xl"
    ></div>
    <div
      class="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-gold-500/30 rounded-tr-xl"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-500/30 rounded-bl-xl"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/30 rounded-br-xl"
    ></div>

    <div class="relative z-10">
      <h3 class="font-display text-gold-400 text-lg mb-4 flex items-center gap-2">
        <span class="text-gold-500/50" aria-hidden="true">&#10022;</span>
        {{ heading }}
        <span class="text-gold-500/50" aria-hidden="true">&#10022;</span>
      </h3>

      <p
        v-if="error"
        class="mb-4 rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        role="alert"
      >
        {{ error }}
      </p>

      <div
        v-if="text || isStreaming"
        class="text-mystic-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base"
        aria-live="polite"
        aria-atomic="false"
      >
        {{ text
        }}<span v-if="isStreaming" class="inline-flex ml-1" aria-hidden="true"
          ><span class="animate-pulse text-gold-500">...</span></span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.reading-container {
  box-shadow:
    0 0 30px rgba(53, 53, 122, 0.1),
    inset 0 0 60px rgba(212, 168, 83, 0.02);
}

@media (prefers-reduced-motion: reduce) {
  .reading-container {
    box-shadow: 0 0 10px rgba(53, 53, 122, 0.1);
  }
}
</style>
