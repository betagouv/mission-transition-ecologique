import path from 'path'
import fs from 'fs'
import { Baserow } from '../common/baserow/baserow'

export class OperatorYamlGenerator {
  outputDirectory: string = path.join(__dirname, '../../schemas/')

  async createOperatorsJsonSchema(): Promise<void> {
    const operators: string[] = await new Baserow(this.outputDirectory).getOperators()
    this._writeJsonSchema(operators)
    return
  }

  private _writeJsonSchema(operators: string[]) {
    const schemaContent = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'string',
      enum: operators
    }

    const filePath = path.join(this.outputDirectory, 'operators-schema.json')
    fs.writeFileSync(filePath, JSON.stringify(schemaContent, null, 2))
  }
}
