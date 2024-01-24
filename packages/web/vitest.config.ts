import { fileURLToPath } from 'node:url'
import { defineConfig, configDefaults, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      // include: ['src/**/*.vue'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
