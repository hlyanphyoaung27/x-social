import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3030,
    open: true,
  },
  build: {
    target: ['es2022', 'chrome90', 'firefox94', 'safari15'], // Set target to support top-level await
  },
})
