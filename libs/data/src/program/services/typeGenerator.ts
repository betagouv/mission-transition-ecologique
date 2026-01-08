import fs from 'fs'
import path from 'path'
import { compileFromFile } from 'json-schema-to-typescript'
import { FileManager } from '../../common/fileManager'
import { fileURLToPath } from 'url'

export class TypeGenerator {
  private readonly _defaultSchemaPath = '../../../schemas/program-with-publicodes-schema.json'
  private readonly _generatedTypeDir = path.join('src', 'program', 'types')

  async generateProgramType(): Promise<void> {
    console.log('Generating TypeScript Program type from JSON schema.\n')

    const relativeSchemaPath = process.env['SCHEMA_PATH'] || this._defaultSchemaPath
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const schemaPath = path.join(__dirname, relativeSchemaPath)

    FileManager.createFolderIfNotExists(this._generatedTypeDir)

    try {
      const ts = await compileFromFile(schemaPath)
      fs.writeFileSync(path.join(this._generatedTypeDir, 'program.ts'), ts)
      console.log('🖊️ Types successfully written to', this._generatedTypeDir)
    } catch (err) {
      console.error('Error while generating program types:', err)
      throw err
    }
  }
}
