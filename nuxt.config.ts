export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  devtools: { enabled: true },

  vite: {
    plugins: [],
  },

  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  },

  compatibilityDate: '2026-02-26',
})
