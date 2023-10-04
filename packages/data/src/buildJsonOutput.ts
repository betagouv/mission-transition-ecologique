import * as dotenv from 'dotenv'
dotenv.config()

/**
 * Build programs dataset from folder and yaml files
 * Parse data folder to build list of programs
 * Each program must must written as a distinct yaml file
 */

// requiring path and fs modules
import * as path from 'path'
import * as fs from 'fs'
import * as yaml from 'js-yaml'

/** Reads all program data
 *
 * Program data is stored as yaml files, location of the files can be
 * specified with `DATA_DIR_PATH` environment variable. Default location is
 * "packages/data/programs".
 */
const readPrograms = (): any[] => {
  const DEFAULT_PROGRAMS_PATH = '../programs'

  const programs: any[] = []

  // joining path of directory
  const relativeDataDirPath: string = process.env.DATA_DIR_PATH || DEFAULT_PROGRAMS_PATH
  const dataDirPath: string = path.join(__dirname, relativeDataDirPath)
  console.log('📂 Reading data at', dataDirPath, '\n')

  const filenames: string[] = fs.readdirSync(dataDirPath)

  filenames.forEach((file: string) => {
    const id = file.substring(0, file.lastIndexOf('.')) || file

    console.log(' 🗎 Reading program', id)

    const yamlFilePath: string = `${dataDirPath}/${file}`
    const yamlFile: string = fs.readFileSync(yamlFilePath, 'utf8')

    const program = { ...(yaml.load(yamlFile) as Object), id: id } || {}

    programs.push(program)
  })

  return programs
}

const createFolderIfNotExists = (folderName: string): void => {
  try {
    if (!fs.existsSync(folderName)) {
      console.log('📁 Output folder does not exist. Creating...')
      fs.mkdirSync(folderName)
    }
  } catch (err) {
    console.error(err)
  }
}

/** Converts program data to JSON and writes it to a file.
 *
 * Location defaults to `packages/web/public/data/generated` but can be
 * specified with `DATA_FRONT_GENERATED_DIR_PATH` environment variable.
 */
const buildJSONOutput = (programs: any[]): void => {
  const DEFAULT_OUTPUT_LOCATION = '../../web/public/data/generated'

  console.log('♺ Converting data to JSON')
  const dataAsJson: string = JSON.stringify(programs, null, 2)

  const dataBuiltOutputDir: string = path.join(
    __dirname,
    process.env.DATA_FRONT_GENERATED_DIR_PATH || DEFAULT_OUTPUT_LOCATION
  )

  createFolderIfNotExists(dataBuiltOutputDir)

  const dataOutPath: string = `${dataBuiltOutputDir}/dataset_out.json`
  fs.writeFileSync(dataOutPath, dataAsJson)
  console.log('🖊️  Data successfully written at', dataOutPath)
}

// Script

console.log('▶ Starting data consolidation (buildJsonOutput.ts)\n')

const programs = readPrograms()

console.log()

buildJSONOutput(programs)
