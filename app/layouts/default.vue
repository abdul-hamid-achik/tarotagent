<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="stars-bg min-h-[100dvh] flex flex-col">
    <div class="grain-overlay" aria-hidden="true"></div>

    <header class="relative border-b border-mystic-700/50 px-6 py-4">
      <div
        class="absolute inset-0 bg-gradient-to-b from-mystic-800/50 to-transparent pointer-events-none"
      ></div>
      <div class="relative mx-auto flex max-w-6xl items-center justify-center">
        <NuxtLink
          to="/"
          class="rounded-sm focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-4 focus:ring-offset-mystic-900"
          aria-label="Tarot Agent home"
        >
          <h1 class="font-display text-2xl font-semibold text-gold-500 tracking-wide relative">
            <span class="relative z-10">Tarot Agent</span>
            <span aria-hidden="true" class="absolute inset-0 blur-md opacity-50 text-gold-400">
              Tarot Agent
            </span>
          </h1>
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1 px-4 py-6 sm:py-8">
      <div class="mx-auto w-full max-w-6xl">
        <slot />
      </div>
    </main>

    <footer class="relative border-t border-mystic-700/50 px-6 py-4">
      <div
        class="absolute inset-0 bg-gradient-to-t from-mystic-800/30 to-transparent pointer-events-none"
      ></div>
      <div class="relative mx-auto max-w-6xl text-center">
        <p class="text-sm text-mystic-400">
          &copy; {{ currentYear }} Tarot Agent &middot; For entertainment purposes only
        </p>
      </div>
    </footer>
  </div>
</template>
