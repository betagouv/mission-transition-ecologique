import path from 'path'
import fs from 'fs'
import { OperatorBaserow } from '../common/baserow/operatorBaserow'
import { RawOperator } from './types/domain'
import { FileManager } from '../common/fileManager'

export class OperatorFeatures {
  private readonly _outputFilePath: string = path.join(__dirname, '../../static/operators.json')
  private readonly _outputTypeFilePath: string = path.join(__dirname, './types/generatedShared.ts')
  private readonly _schemaFilePath = path.join(__dirname, '../../schemas/program-with-publicodes-schema.json')
  async updateOperatorsData() {
    const operators = await new OperatorBaserow().getAll()
    FileManager.writeJson(this._outputFilePath, operators, 'operator.json updated')

    this._updateJsonSchema(operators)
    this._generateOperatorsFiltersCategoryType(operators)
  }

  private _updateJsonSchema(operators: RawOperator[]) {
    const schema = JSON.parse(fs.readFileSync(this._schemaFilePath, 'utf-8'))
    const operatorsName = operators.map((operator) => operator.operator)

    if (schema.$defs && schema.$defs.operators) {
      schema.$defs.operators.enum = operatorsName

      FileManager.writeJson(this._schemaFilePath, schema, 'Field operator of the jsonSchema updated')
    }
  }

  private _generateOperatorsFiltersCategoryType(operators: RawOperator[]) {
    const filterOptions = [...new Set(operators.flatMap((operator) => operator.filterCategories))]
    const typeDeclaration = this.generateTypeDeclaration(filterOptions)
    FileManager.writeRaw(this._outputTypeFilePath, typeDeclaration, 'OperatorFilter type updated')
  }

  generateTypeDeclaration(data: string[]) {
    let declaration = `export type OperatorFilter =\n`
    for (const value of data) {
      if (value.includes("'")) {
        declaration += `  | "${value}"\n`
      } else {
        declaration += `  | '${value}'\n`
      }
    }

    return declaration
  }
}
