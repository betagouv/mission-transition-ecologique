import { fileURLToPath, URL } from 'node:url'
// import postcssLit from 'rollup-plugin-postcss-lit';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// console.log('process.env', process.env)
// console.log('process.env.NODE_ENV : ', process.env.NODE_ENV)
// @ts-ignore
// console.log('import.meta.env.VITE_APP_TITLE : ', import.meta.env.VITE_APP_TITLE)
// console.log('process.env.VITE_APP_TITLE : ', process.env.VITE_APP_TITLE)
// console.log('process.env.VITE_DEPLOY_URL : ', process.env.VITE_DEPLOY_URL)
// console.log('process.env.VUE_APP_DEPLOY_URL : ', process.env.VUE_APP_DEPLOY_URL)

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
      name: 'gov-aid-tree-app',
      // the proper extensions will be added
      fileName: 'gov-aid-tree-app'
    }
  },
  define: {
    'process.env': process.env,
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
