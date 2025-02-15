import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'cclist.sadoway.ca', // Correctly allow your domain
    port: 4173,
    strictPort: true,
  },
  preview: {
    host: 'cclist.sadoway.ca', // Correctly allow your domain for preview
    port: 4173, // Use the same port as the dev server
    strictPort: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
