import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import tailwind from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [HstVue()],
  setupFile: './histoire.setup.ts',
  // Histoire beta's built-in support plugins import both hooks even for Vue-only stories.
  setupCode: ['export function setupVue3() {}\nexport function setupVanilla() {}'],
  storyMatch: ['**/*.story.vue'],
  vite: {
    plugins: [vue(), tailwind()],
    resolve: {
      alias: {
        '~~': process.cwd(),
        '~': `${process.cwd()}/app`,
      },
    },
    server: {
      hmr: false,
      watch: {
        usePolling: true,
      },
    },
  },
})
