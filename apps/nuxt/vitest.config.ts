/// <reference types='vitest' />
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin'

export default defineConfig({
  root: path.dirname(fileURLToPath(import.meta.url)),
  cacheDir: '../../node_modules/.vite/apps/nuxt',
  plugins: [vue(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Same aliases as Nuxt, for the specs importing app files
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
      '~': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src')
    }
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // Relies on Nuxt auto-imports (computed), which need the Nuxt test environment: to fix before running it again
    exclude: ['src/tools/companyData/companyDataStorage.spec.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/nuxt',
      provider: 'v8'
    }
  }
})
