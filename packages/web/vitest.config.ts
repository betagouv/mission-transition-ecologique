import { fileURLToPath } from 'node:url'
import { defineConfig, configDefaults, mergeConfig, type UserConfig } from 'vitest/config'
import viteConfig from './vite.config'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default mergeConfig(
  viteConfig as UserConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      // include: ['src/**/*.vue'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
