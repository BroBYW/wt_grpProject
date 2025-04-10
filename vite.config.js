import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: './',
  base: '/',
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        floorPlan: resolve(__dirname, 'src/pages/floor-plan.html'),
        gallery: resolve(__dirname, 'src/pages/gallery.html'),
        concept: resolve(__dirname, 'src/pages/concept.html'),
        contact: resolve(__dirname, 'src/pages/contact.html'),
        calculator: resolve(__dirname, 'src/pages/calculator.html')
      }
    }
  }
})