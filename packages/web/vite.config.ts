import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import type { ServerOptions } from 'vite'
import vue from '@vitejs/plugin-vue'

const viteServer: ServerOptions = {
  host: 'localhost',
  port: 4243,
}

export default defineConfig({
  server: viteServer,
  plugins: [
    vue()
  ],
  build: {
    assetsDir: 'assets',
    copyPublicDir: true,
  },
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      // cf: https://stackoverflow.com/questions/72660014/how-to-make-vue-and-vite-work-with-web-components
      '~@gouvfr': fileURLToPath(new URL('../../node_modules/@gouvfr', import.meta.url)),
      '~@gouvminint': fileURLToPath(new URL('../../node_modules/@gouvminint', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@public': fileURLToPath(new URL('./public', import.meta.url)),
      '@icons': fileURLToPath(new URL('../../node_modules/oh-vue-icons', import.meta.url))
    }
  }
})
