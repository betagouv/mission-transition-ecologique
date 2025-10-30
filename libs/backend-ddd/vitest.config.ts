import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

console.log(import.meta.url)

export default defineConfig({
  test: {
    globals: true,
    env: loadEnv('test', process.cwd(), '')
  },
  plugins: [nxViteTsPaths()]
})
