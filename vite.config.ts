import { fileURLToPath, URL } from 'node:url'
// import postcssLit from 'rollup-plugin-postcss-lit';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // postcssLit(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ademe-')
        }
      }
    })
  ],
  build: {
    lib: {
      entry: './src/main.ce.ts',
      name: 'ademe-tee-app',
      // the proper extensions will be added
      fileName: 'ademe-tee-app'
    }
  },
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      // cf: https://stackoverflow.com/questions/72660014/how-to-make-vue-and-vite-work-with-web-components
      '~@gouvfr': fileURLToPath(new URL('./node_modules/@gouvfr', import.meta.url)),    
      '~@gouvminint': fileURLToPath(new URL('./node_modules/@gouvminint', import.meta.url)),    
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
