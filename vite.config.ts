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


// requiring path and fs modules
import * as path from 'path'
import * as fs  from 'fs'
import * as yaml from 'js-yaml'
const programsArray = <any[]>[]
// joining path of directory 
const directoryPath = path.join( __dirname, './public/data/programs')
console.log('TeeApp > main.ce.ts > __dirname :', __dirname)
console.log('TeeApp > main.ce.ts > directoryPath :', directoryPath)
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log('TeeApp > main.ce.ts > err > Unable to scan directory: ' + err)
  } 
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    console.log('\nTeeApp > main.ce.ts > file :', file)
    const yamlFile = fs.readFileSync(`${directoryPath}/${file}`, "utf8");
    const yamlObj = yaml.load(yamlFile)
    console.log('TeeApp > main.ce.ts > yamlObj :', yamlObj)
    programsArray.push(yamlObj)
  })
})

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 4242,
    open: '/index.html',
    // open: '/public/index.html', // test other index file
  },
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
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
    lib: {
      entry: './src/main.ce.ts',
      name: 'gov-aid-tree-app',
      // the proper extensions will be added
      fileName: 'gov-aid-tree-app'
    }
  },
  define: {
    'process.env': process.env,
    'process.env.programs': programsArray,
  },
  resolve: {
    alias: {
      // cf: https://stackoverflow.com/questions/72660014/how-to-make-vue-and-vite-work-with-web-components
      '~@gouvfr': fileURLToPath(new URL('./node_modules/@gouvfr', import.meta.url)),    
      '~@gouvminint': fileURLToPath(new URL('./node_modules/@gouvminint', import.meta.url)),    
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@icons': fileURLToPath(new URL('./node_modules/oh-vue-icons', import.meta.url)),    
    }
  }
})
