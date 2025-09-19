import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    name: '@tee/data',
    globals: true
  },
  resolve: {
    alias: {
      '@tee/common': resolve(__dirname, '../common/src/index.ts')
    }
  }
})
