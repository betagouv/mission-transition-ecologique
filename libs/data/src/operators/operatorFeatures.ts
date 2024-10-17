import path from 'path'
import fs from 'fs'
import { OperatorBaserow } from '../common/baserow/operatorBaserow'
import { EnrichedOperator } from './types/shared'
import { FileManager } from '../common/fileManager'

export class OperatorFeatures {
  private readonly _outputFilePath: string = path.join(__dirname, '../../static/operators.json')
  private readonly _schemaFilePath = path.join(__dirname, '../../schemas/program-with-publicodes-schema.json')
  async updateOperatorsData() {
    const operators = await new OperatorBaserow().getAll()
    FileManager.writeJson(this._outputFilePath, operators, 'operator.json updated')

    this._updateJsonSchema(operators)
  }

  private _updateJsonSchema(operators: EnrichedOperator[]) {
    const schema = JSON.parse(fs.readFileSync(this._schemaFilePath, 'utf-8'))
    const operatorsName = operators.map((operator) => operator.operator)

    if (schema.$defs && schema.$defs.operators) {
      schema.$defs.operators.enum = operatorsName

      FileManager.writeJson(this._schemaFilePath, schema, 'Field operator of the jsonSchema updated')
    }
  }
}
