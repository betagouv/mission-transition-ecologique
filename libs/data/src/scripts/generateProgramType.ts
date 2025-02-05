// requiring path and fs modules
import fs from 'fs'
import { compileFromFile } from 'json-schema-to-typescript'
import path from 'path'
import { FileManager } from '../common/fileManager'
import { fileURLToPath } from 'url'

/** generates a .d.ts typescript type for a Program object, from its
 * json-schema specification
 */
const generateProgramType = (): void => {
  console.log('💥 generating typescript Program type from the json schema specification.\n')

  const DEFAULT_SCHEMA_PATH = '../../schemas/program-with-publicodes-schema.json'
  const relativeSchemaPath: string = process.env['SCHEMA_PATH'] || DEFAULT_SCHEMA_PATH
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const schemaPath: string = path.join(__dirname, relativeSchemaPath)

  console.log('Reading json schema at', schemaPath)

  const generatedTypeDir = path.join('src', 'program', 'types')
  FileManager.createFolderIfNotExists(generatedTypeDir)

  compileFromFile(schemaPath)
    .then((ts: string) => fs.writeFileSync(path.join(generatedTypeDir, 'program.ts'), ts))
    .catch((err: Error) => console.error(err))

  console.log('🖊️ Types successfully written to', generatedTypeDir)
}

console.log('▶ Starting generating program type (generateProgramType.ts)\n')

generateProgramType()

console.log()
