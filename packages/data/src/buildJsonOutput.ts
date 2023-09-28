console.log()
console.log('Starting ...')
console.log('buildJsonOutput.ts ...')

import * as dotenv from 'dotenv'
dotenv.config()

// console.log('process.env.NODE_ENV : ', process.env.NODE_ENV)
// console.log('process.env', process.env)

// const CurrentDirectory = process.cwd()
// console.log('buildJsonOutput.ts > CurrentDirectory : ', CurrentDirectory)

/*
// Build programs dataset from folder and yaml files
// Parse data folder to build list of programs
// Each program must must written as a distinct yaml file
// cf : https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
*/
// requiring path and fs modules
import * as path from 'path'
import * as fs from 'fs'
import * as yaml from 'js-yaml'

const programsArray = <any[]>[]

// joining path of directory
const dataDirPathTemp: string = process.env.DATA_DIR_PATH || '../programs'
const dataDirPath: string = path.join(__dirname, dataDirPathTemp)
console.log('buildJsonOutput.ts > __dirname :', __dirname)
console.log('buildJsonOutput.ts > dataDirPath :', dataDirPath)

// passsing dataDirPath and callback function
const filesNames: string[] = fs.readdirSync(dataDirPath)
console.log('buildJsonOutput.ts > filesNames :', filesNames)

filesNames.forEach((file: string) => {
  // Do whatever you want to do with the file
  console.log()
  console.log('buildJsonOutput.ts > file :', file)
  const yamlFilePath: string = `${dataDirPath}/${file}`
  const yamlFile: string = fs.readFileSync(yamlFilePath, 'utf8')

  const id = file.substring(0, file.lastIndexOf('.')) || file
  const yamlObj = { ...(yaml.load(yamlFile) as Object), id: id } || {}

  // @ts-ignore
  console.log('buildJsonOutput.ts > yamlObj.titre :', yamlObj.titre)
  programsArray.push(yamlObj)
})
// console.log('buildJsonOutput.ts > programsArray :', programsArray)

// build output json
const dataAsJson: string = JSON.stringify(programsArray, null, 2)
const dataBuiltOutputDir: string = process.env.DATA_FRONT_GENERATED_DIR_PATH || '../../web/public/data/generated'
const dataBuiltOutput: string = `${dataBuiltOutputDir}/dataset_out.json`
const dataOutPath: string = path.join(__dirname, dataBuiltOutput)
fs.writeFileSync(dataOutPath, dataAsJson)

console.log()
console.log('buildJsonOutput.ts > finished writing output json...')