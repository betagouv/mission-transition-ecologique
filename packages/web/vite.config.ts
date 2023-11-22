import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import { type BuildOptions, defineConfig } from 'vite'
import type { ServerOptions } from 'vite'
import vue from '@vitejs/plugin-vue'

type LibType = 'main' | 'widget';

const LIB: LibType = (process.env.LIB as LibType) ?? 'main';

const libConfig: Record<LibType, BuildOptions> = {
  main: {
    emptyOutDir: false,
  },
  widget: {
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'widget.html'),
    },
    lib: {
      name: 'gov-aid-tree-app',
      entry: "widget/widget.ce.ts",
      fileName: 'widget',
    }
  },
};

const currentConfig = libConfig[LIB];

const viteServer: ServerOptions = {
  host: '0.0.0.0',
  port: 4242,
}

export default defineConfig({
  server: viteServer,
  plugins: [
    vue()
  ],
  build: currentConfig,
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
