/**
 * Test setup for legal disclosure page testing
 * 特定商取引法に基づく表記ページのテスト設定
 */

import { beforeEach } from 'vitest'

// Mock window object for SSR compatibility
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Reset DOM before each test
beforeEach(() => {
  document.head.innerHTML = ''
  document.body.innerHTML = ''
})