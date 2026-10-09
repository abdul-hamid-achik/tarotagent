<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

// Only the public status message is shown. Stack traces and raw error details never reach the page.
const statusCode = computed(() => props.error.statusCode || 500)
const message = computed(
  () =>
    props.error.statusMessage ||
    (statusCode.value === 404 ? 'Page not found.' : 'Something went wrong.'),
)
const hint = computed(() =>
  statusCode.value === 404
    ? 'The link may be mistyped, or this reading is no longer saved.'
    : 'Something went wrong on our side. Try again in a moment.',
)

useSeoMeta({
  title: `${message.value} - Tarot Agent`,
  robots: 'noindex',
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <section
      class="mx-auto flex min-h-[70dvh] w-full max-w-xl flex-col items-center justify-center gap-5 px-4 py-20 text-center"
    >
      <p class="font-display text-xs tracking-[0.3em] text-mystic-500" aria-hidden="true">
        {{ statusCode }}
      </p>
      <h1 class="text-balance font-display text-3xl leading-tight text-gold-300 sm:text-4xl">
        {{ message }}
      </h1>
      <p class="max-w-sm text-sm leading-relaxed text-mystic-300">
        {{ hint }}
      </p>
      <UButton
        size="lg"
        class="mt-2 h-11 justify-center px-6 !border-gold-500 !bg-gold-500 !text-mystic-900 hover:!bg-gold-400"
        @click="goHome"
      >
        Get a reading
      </UButton>
    </section>
  </NuxtLayout>
</template>
