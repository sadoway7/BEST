import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Correctly allow your domain
    port: 4173,
    strictPort: true,
    allowedHosts: ['test.sadoway.ca', 'cc2.sadoway.ca'],
  },
  preview: {
    host: '0.0.0.0', // Correctly allow your domain for preview
    port: 4173, // Use the same port as the dev server
    strictPort: true,
    allowedHosts: ['test.sadoway.ca', 'cc2.sadoway.ca'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
