export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  devtools: { enabled: true },

  vite: {
    plugins: [],
  },

  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    public: {
      siteUrl: process.env.SITE_URL || 'https://tarotagent.vercel.app',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Tarot Agent — AI-Powered Tarot Readings',
      meta: [
        {
          name: 'description',
          content:
            'Get mystical tarot readings powered by AI. Choose from 6 spread types including Celtic Cross, Love, and Career. Beautiful pixel-art Major Arcana cards with streaming interpretations.',
        },
        { name: 'theme-color', content: '#0a0a1a' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Tarot Agent — AI-Powered Tarot Readings' },
        {
          property: 'og:description',
          content:
            'Consult the cards. AI-powered tarot readings with beautiful pixel-art Major Arcana and 6 unique spread types.',
        },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:site_name', content: 'Tarot Agent' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Tarot Agent — AI-Powered Tarot Readings' },
        {
          name: 'twitter:description',
          content:
            'Consult the cards. AI-powered tarot readings with beautiful pixel-art Major Arcana and 6 unique spread types.',
        },
        { name: 'twitter:image', content: '/og-image.png' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },

  compatibilityDate: '2026-02-26',
})
