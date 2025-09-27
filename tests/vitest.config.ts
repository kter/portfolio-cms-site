import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./setup.ts']
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '../'),
      '@': resolve(__dirname, '../'),
      '@@': resolve(__dirname, '../'),
      'assets': resolve(__dirname, '../assets'),
      'public': resolve(__dirname, '../public'),
    }
  }
})