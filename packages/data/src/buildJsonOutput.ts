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
import { compileFromFile } from 'json-schema-to-typescript'
import type { Dispositif as ProgramWithoutId } from './generated/program'

type Program = ProgramWithoutId & { id: string }

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

/** generates a .d.ts typescript type for a Program object, from its
 * json-schema specification
 */
const generateProgramType = (): void => {
  console.log('💥 generating typescript Program type from the json schema specification.\n')
  const jsonschemaPath =
    '/home/pierre/Documents/multi/ademe/transition-ecologique-entreprises-widget/packages/backend/data/program-data-schema.json'
  const generatedTypeDir = path.join('src', 'generated')

  createFolderIfNotExists(generatedTypeDir)

  compileFromFile(jsonschemaPath).then((ts) =>
    fs.writeFileSync(path.join(generatedTypeDir, 'program.d.ts'), ts)
  )
}

/** Reads all program data
 *
 * Program data is stored as yaml files, location of the files can be
 * specified with `DATA_DIR_PATH` environment variable. Default location is
 * "packages/data/programs".
 */
const readPrograms = (): any[] => {
  const DEFAULT_PROGRAMS_PATH = '../programs'

  const programs: Program[] = []

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

    const program: Program = { ...(yaml.load(yamlFile) as ProgramWithoutId), id: id }

    programs.push(program)
  })

  return programs
}

const prependConstants = (programs: Program[]): Program[] => {
  const CONSTANTS_PATH = './../common/constants.yaml'

  const fullPath: string = path.join(__dirname, CONSTANTS_PATH)

  console.log('🗎 reading constants at', fullPath)
  const file: string = fs.readFileSync(fullPath, 'utf8')
  const constants = yaml.load(file) as Record<string, unknown>

  console.log('➕ prepending publicodes with common constants')

  return programs.map((p) => {
    p.publicodes = { ...constants, ...p.publicodes }
    return p
  })
}

/** Converts program data to JSON and writes it to a file.
 *
 * Location defaults to `packages/web/public/data/generated` but can be
 * specified with `DATA_FRONT_GENERATED_DIR_PATH` environment variable.
 */
const buildJSONOutput = (programs: Program[]): void => {
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

generateProgramType()

var programs = readPrograms()

console.log()

programs = prependConstants(programs)

console.log()

buildJSONOutput(programs)
