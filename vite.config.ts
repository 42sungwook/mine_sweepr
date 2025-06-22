import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `
          @use "${fileURLToPath(
            new URL('./src/shared/styles/mixins', import.meta.url)
          )}" as *;
					@use "${fileURLToPath(
            new URL('./src/shared/styles/variables', import.meta.url)
          )}" as *;
        `
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
