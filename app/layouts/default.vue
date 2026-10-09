<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="stars-bg flex min-h-[100dvh] flex-col">
    <div class="grain-overlay" aria-hidden="true"></div>

    <header class="app-header px-4 pt-3 sm:px-6 sm:pt-4">
      <div
        class="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 rounded-full border border-white/[0.07] bg-mystic-900/75 pl-5 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:pl-6"
      >
        <NuxtLink
          to="/"
          class="shrink-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-4 focus:ring-offset-mystic-900"
          aria-label="Tarot Agent home"
        >
          <span class="font-display text-xl font-semibold tracking-wide text-gold-500 sm:text-2xl">
            Tarot Agent
          </span>
        </NuxtLink>
        <div id="header-actions" class="flex min-w-0 items-center justify-end"></div>
      </div>
    </header>

    <main class="flex-1 px-4 pb-12 pt-6 sm:px-6 sm:pt-12">
      <div class="mx-auto w-full max-w-5xl">
        <slot />
      </div>
    </main>

    <footer class="px-4 pb-8 pt-6 sm:px-6">
      <div class="mx-auto flex max-w-5xl justify-center border-t border-mystic-800 pt-6">
        <p class="text-center text-xs leading-relaxed text-mystic-400">
          &copy; {{ currentYear }} Tarot Agent &middot; For entertainment purposes only
        </p>
      </div>
    </footer>
  </div>
</template>
