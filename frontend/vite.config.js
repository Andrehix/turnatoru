import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: '127.0.0.1',
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/agents': 'http://127.0.0.1:8000',
      '/login': 'http://127.0.0.1:8000',
      '/logout': 'http://127.0.0.1:8000',
      '/register': 'http://127.0.0.1:8000',
      '/dashboard': 'http://127.0.0.1:8000',
      '/token-login': 'http://127.0.0.1:8000',
      '/admin-dashboard': 'http://127.0.0.1:8000',
      '/token': 'http://127.0.0.1:8000',
    },
  },
})
