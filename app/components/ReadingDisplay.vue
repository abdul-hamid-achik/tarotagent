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
  <article
    v-if="text || isStreaming || error"
    class="reading-panel relative rounded-2xl border border-mystic-600/25 bg-mystic-800/50 px-5 py-7 sm:px-10 sm:py-10"
    :aria-busy="isStreaming"
  >
    <header class="mb-6 flex items-center justify-between gap-4">
      <h3 class="flex items-center gap-3 font-display text-lg text-gold-300 sm:text-xl">
        <span class="h-px w-6 bg-gold-500/50" aria-hidden="true" />
        {{ heading }}
      </h3>
      <span
        v-if="isStreaming"
        class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-mystic-400"
        aria-hidden="true"
      >
        <span class="writing-dots" aria-hidden="true"><i /><i /><i /></span>
        Writing
      </span>
    </header>

    <p
      v-if="error"
      class="mb-6 rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
      role="alert"
    >
      {{ error }}
    </p>

    <div
      v-if="text || isStreaming"
      class="reading-body mx-auto max-w-[65ch] whitespace-pre-wrap text-[15px] leading-[1.8] text-mystic-100 sm:text-[17px] sm:leading-[1.85]"
      aria-live="polite"
      aria-atomic="false"
    >
      {{ text }}
    </div>
  </article>
</template>

<style scoped>
.reading-panel {
  box-shadow:
    0 24px 60px -30px rgba(7, 7, 25, 0.8),
    inset 0 1px 0 rgba(212, 168, 83, 0.06);
}

/* Drop cap on the first letter of the reading. */
.reading-body::first-letter {
  float: left;
  margin: 0.08em 0.12em 0 0;
  font-family: var(--font-family-display);
  font-size: 3.4em;
  line-height: 0.85;
  color: var(--color-gold-400);
}

.writing-dots {
  display: inline-flex;
  gap: 3px;
}

.writing-dots i {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background: currentColor;
  color: #d4a853;
  opacity: 0.3;
  animation: writing-dot 1.2s ease-in-out infinite;
}

.writing-dots i:nth-child(2) {
  animation-delay: 0.15s;
}

.writing-dots i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes writing-dot {
  0%,
  100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .writing-dots i {
    animation: none;
    opacity: 0.7;
  }
}
</style>
