import { fileURLToPath, URL } from 'node:url'
// import { resolve } from 'path'
// import postcssLit from 'rollup-plugin-postcss-lit';

import { defineConfig, loadEnv } from 'vite'
import type { ServerOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

console.log()
console.log('Starting ...')
console.log('vite.config ...')

console.log('process.env.NODE_ENV : ', process.env.NODE_ENV)
console.log('process.env', process.env)

const mode = process.env.NODE_ENV || 'development'
console.log('vite.config > mode : ', mode)
const rawEnv = loadEnv(mode, process.cwd())
console.log('vite.config > rawEnv : ', rawEnv)

const isProd = mode === 'production'

// VITE CONFIG
const viteServer: ServerOptions = {
  // host: 'localhost',
  host: '0.0.0.0'
  // port: 4242,
  // open: '/index.html',
  // open: '/public/index.html', // test other index file
}

// Set Vite config
// https://vitejs.dev/config/
export default defineConfig({
  server: viteServer,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [
    vue(),
    {
      ...eslintPlugin(),
      apply: isProd ? 'serve' : undefined
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    },
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
    lib: {
      entry: 'src/main.ce.ts',
      name: 'gov-aid-tree-app',
      // the proper extensions will be added
      fileName: 'gov-aid-tree-app'
    }
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
