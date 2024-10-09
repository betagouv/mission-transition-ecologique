import path from 'path'
import fs from 'fs'
import { OperatorBaserow } from '../common/baserow/operatorBaserow'
import { EnrichedOperator } from './types/shared'

export class OperatorFeatures {
  private readonly _outputDirectory: string = path.join(__dirname, '../../static/')
  private readonly _schemaFile = path.join(__dirname, '../../schemas/program-with-publicodes-schema.json')
  async updateOperatorsData() {
    const operators = await new OperatorBaserow().getAll()
    this._writeJson(operators)

    this._updateJsonSchema(operators)
  }

  private _writeJson(operators: EnrichedOperator[]) {
    const projectJson = JSON.stringify(operators, null, 2)
    const fullPath = path.join(this._outputDirectory, 'operators.json')
    fs.writeFile(fullPath, projectJson, (err) => {
      if (err) {
        console.log('Error writing file:', err)
      } else {
        console.log('Successfully wrote file')
      }
    })
  }

  private _updateJsonSchema(operators: EnrichedOperator[]) {
    const schema = JSON.parse(fs.readFileSync(this._schemaFile, 'utf-8'))
    const operatorsName = operators.map((operator) => operator.operator)

    if (schema.$defs && schema.$defs.operators) {
      schema.$defs.operators.enum = operatorsName

      fs.writeFileSync(this._schemaFile, JSON.stringify(schema, null, 2))
      console.log('Schema updated successfully!')
    }
  }
}
