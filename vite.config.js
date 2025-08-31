import { defineConfig } from 'vite'

export default defineConfig({
  base: '/website-with-gpt-and-html-artifact/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
