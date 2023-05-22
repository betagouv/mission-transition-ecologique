import { fileURLToPath, URL } from 'node:url'
// import postcssLit from 'rollup-plugin-postcss-lit';

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

console.log()
console.log('Starting ...') 
console.log('vite.config ...')

// console.log('process.env', process.env)
// console.log('process.env.NODE_ENV : ', process.env.NODE_ENV)

const mode = process.env.NODE_ENV || 'development'
// console.log('vite.config > mode : ', mode)
const rawEnv = loadEnv(mode, process.cwd())
// console.log('vite.config > rawEnv : ', rawEnv)

// Build programs dataset from folder and yaml files
// requiring path and fs modules
import * as path from 'path'
import * as fs  from 'fs'
import * as yaml from 'js-yaml'
const programsArray = <any[]>[]
// joining path of directory 
const dataDiryPathTemp = rawEnv.VITE_DATA_DIR_PATH || './public/data/programs'
const dataDiryPath = path.join( __dirname, dataDiryPathTemp)
// console.log('vite.config > __dirname :', __dirname)
console.log('vite.config > dataDiryPath :', dataDiryPath)
// passsing dataDiryPath and callback function
fs.readdir(dataDiryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log('vite.config > main.ce.ts > err > Unable to scan directory: ' + err)
  } 
  //listing all files using forEach
  files.forEach(file => {
    // Do whatever you want to do with the file
    // console.log()
    console.log('vite.config > file :', file)
    const yamlFile = fs.readFileSync(`${dataDiryPath}/${file}`, "utf8");
    const yamlObj = yaml.load(yamlFile)
    // console.log('vite.config > yamlObj :', yamlObj)
    programsArray.push(yamlObj)
  })
})

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 4242,
    // open: '/index.html',
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
