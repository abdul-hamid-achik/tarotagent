<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="stars-bg min-h-screen flex flex-col">
    <header class="border-b border-mystic-700/50 px-6 py-4">
      <div class="mx-auto max-w-5xl flex items-center justify-center">
        <h1 class="font-[family-name:var(--font-family-display)] text-2xl font-semibold text-gold-500 tracking-wide">
          Tarot Agent
        </h1>
      </div>
    </header>

    <main class="flex-1 px-4 py-8">
      <div class="mx-auto max-w-5xl">
        <slot />
      </div>
    </main>

    <footer class="border-t border-mystic-700/50 px-6 py-4">
      <div class="mx-auto max-w-5xl text-center">
        <p class="text-sm text-mystic-400">
          &copy; {{ currentYear }} Tarot Agent &middot; For entertainment purposes only
        </p>
      </div>
    </footer>
  </div>
</template>
