import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    name: '@tee/backend-ddd',
    globals: true,
    environment: 'node',
    env: loadEnv('test', process.cwd(), '')
  },
  resolve: {
    alias: {
      '@tee/common': resolve(__dirname, '../common/src/index.ts'),
      '@tee/data': resolve(__dirname, '../data/src/index.ts')
    }
  }
})
