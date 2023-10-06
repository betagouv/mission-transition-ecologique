// requiring path and fs modules
import * as path from 'path'
import * as fs from 'fs'
import { compileFromFile } from 'json-schema-to-typescript'
import { createFolderIfNotExists } from './helpers'

/** generates a .d.ts typescript type for a Program object, from its
 * json-schema specification
 */
const generateProgramType = (): void => {
  console.log('💥 generating typescript Program type from the json schema specification.\n')

  const DEFAULT_SCHEMAS_PATH = '../schemas'
  const relativeSchemaDirPath: string = process.env.SCHEMAS_DIR_PATH || DEFAULT_SCHEMAS_PATH

  const schemaDirPath: string = path.join(__dirname, relativeSchemaDirPath)
  const schemaFileName = 'program-data-schema.json'

  const jsonSchemaPath = path.join(schemaDirPath, schemaFileName)

  const generatedTypeDir = path.join('src', 'generated')
  createFolderIfNotExists(generatedTypeDir)

  compileFromFile(jsonSchemaPath).then((ts) =>
    fs.writeFileSync(path.join(generatedTypeDir, 'program.d.ts'), ts)
  )
}

console.log('▶ Starting generating program type (generateProgramType.ts)\n')

generateProgramType()