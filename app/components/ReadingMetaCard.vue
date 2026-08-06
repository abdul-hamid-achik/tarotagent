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
    class="w-full max-w-3xl rounded-xl border border-mystic-600/30 bg-mystic-800/40 p-4 sm:p-6"
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
      <div
        v-if="shareUrl"
        class="flex flex-wrap items-center gap-2 text-xs text-mystic-300"
        :data-share-url="shareUrl"
      >
        <span
          class="rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-gold-300"
        >
          Saved reading
        </span>
        <span>Link ready to share</span>
        <span v-if="shareSlug" class="text-mystic-400">Ref {{ shareSlug }}</span>
      </div>
    </div>
  </section>
</template>
