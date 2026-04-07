<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="stars-bg min-h-screen flex flex-col">
    <header class="relative border-b border-mystic-700/50 px-6 py-4">
      <div
        class="absolute inset-0 bg-gradient-to-b from-mystic-800/50 to-transparent pointer-events-none"
      ></div>
      <div class="mx-auto max-w-5xl flex items-center justify-center relative">
        <h1
          class="font-[family-name:var(--font-family-display)] text-2xl font-semibold text-gold-500 tracking-wide relative"
        >
          <span class="relative z-10">Tarot Agent</span>
          <span class="absolute inset-0 blur-md opacity-50 text-gold-400">Tarot Agent</span>
        </h1>
      </div>
    </header>

    <main class="flex-1 px-4 py-6 sm:py-8">
      <div class="mx-auto max-w-5xl">
        <slot />
      </div>
    </main>

    <footer class="relative border-t border-mystic-700/50 px-6 py-4">
      <div
        class="absolute inset-0 bg-gradient-to-t from-mystic-800/30 to-transparent pointer-events-none"
      ></div>
      <div class="mx-auto max-w-5xl text-center relative">
        <p class="text-sm text-mystic-400">
          &copy; {{ currentYear }} Tarot Agent &middot; For entertainment purposes only
        </p>
      </div>
    </footer>
  </div>
</template>
