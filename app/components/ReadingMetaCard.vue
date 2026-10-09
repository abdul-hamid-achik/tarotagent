<script setup lang="ts">
withDefaults(
  defineProps<{
    spreadName: string
    question: string
    spreadDescription: string
    shareSlug?: string | null
    shareUrl?: string | null
    badge?: string
    showSavedBadge?: boolean
  }>(),
  {
    shareSlug: null,
    shareUrl: null,
    badge: undefined,
    showSavedBadge: true,
  },
)
</script>

<template>
  <section
    class="w-full max-w-3xl rounded-xl border border-mystic-600/25 bg-mystic-800/35 px-5 py-5 sm:px-7 sm:py-6"
    aria-labelledby="reading-meta-heading"
  >
    <div class="flex flex-col gap-3">
      <p
        class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.18em] text-mystic-400"
      >
        <span v-if="badge" class="text-gold-400">{{ badge }}</span>
        <span v-if="badge" aria-hidden="true" class="text-mystic-600">/</span>
        <span>{{ spreadName }}</span>
        <template v-if="shareSlug">
          <span aria-hidden="true" class="text-mystic-600">/</span>
          <span class="normal-case tracking-wide text-mystic-400">Ref {{ shareSlug }}</span>
        </template>
      </p>
      <h2
        id="reading-meta-heading"
        class="text-balance font-display text-xl leading-snug text-gold-300 sm:text-2xl"
      >
        {{ question }}
      </h2>
      <p class="text-sm leading-relaxed text-mystic-300">
        {{ spreadDescription }}
      </p>
      <div
        v-if="shareUrl"
        class="flex flex-wrap items-center gap-2 text-xs"
        :data-share-url="shareUrl"
      >
        <span
          v-if="showSavedBadge"
          class="inline-flex items-center rounded-full border border-gold-500/35 bg-gold-500/10 px-2.5 py-1 font-medium text-gold-300"
        >
          Saved reading
        </span>
      </div>
    </div>
  </section>
</template>
