<script setup lang="ts">
withDefaults(
  defineProps<{
    spreadName: string
    question: string
    spreadDescription: string
    shareSlug?: string | null
    shareUrl?: string | null
    badge?: string
  }>(),
  {
    shareSlug: null,
    shareUrl: null,
    badge: undefined,
  },
)
</script>

<template>
  <section
    class="w-full max-w-2xl rounded-xl border border-mystic-600/30 bg-mystic-800/40 p-4 sm:p-6"
    aria-labelledby="reading-meta-heading"
  >
    <div class="flex flex-col gap-3">
      <div
        class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-mystic-400"
      >
        <span v-if="badge" class="text-gold-400">{{ badge }}</span>
        <span>{{ spreadName }}</span>
        <span v-if="shareSlug">&middot; Ref {{ shareSlug }}</span>
      </div>
      <h2 id="reading-meta-heading" class="font-display text-lg sm:text-xl text-gold-300">
        {{ question }}
      </h2>
      <p class="text-sm text-mystic-300">
        {{ spreadDescription }}
      </p>
      <p v-if="shareUrl" class="text-xs text-mystic-400 break-all">Saved reading: {{ shareUrl }}</p>
    </div>
  </section>
</template>
