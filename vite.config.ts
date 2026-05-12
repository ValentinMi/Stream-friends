import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    tanstackStart({
      router: {
        routeFileIgnorePattern: 'api',
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
})
