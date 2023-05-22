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
const dataDirPathTemp = rawEnv.VITE_DATA_DIR_PATH || './public/data/programs'
const dataDirPath = path.join( __dirname, dataDirPathTemp)
// console.log('vite.config > __dirname :', __dirname)
console.log('vite.config > dataDirPath :', dataDirPath)

// passsing dataDiryPath and callback function
const filesNames = fs.readdirSync(dataDirPath)
console.log('vite.config > filesNames :', filesNames)
filesNames.forEach(file => {
  // Do whatever you want to do with the file
  console.log()
  console.log('vite.config > file :', file)
  const yamlFilePath = `${dataDirPath}/${file}`
  const yamlFile = fs.readFileSync(yamlFilePath, 'utf8')
  const yamlObj = yaml.load(yamlFile) || {}
  // yamlObj.file = file
  // @ts-ignore
  console.log('vite.config > yamlObj.title :', yamlObj.title)
  programsArray.push(yamlObj)
})
console.log('vite.config > programsArray :', programsArray)

// build output json
const dataAsJson = JSON.stringify(programsArray)
const dataBuiltOutput = './public/data/output/dataset_out.json'
const dataOutPath = path.join( __dirname, dataBuiltOutput)
fs.writeFileSync(dataOutPath, dataAsJson, 'utf-8')

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
