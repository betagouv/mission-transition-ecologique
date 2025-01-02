import path from 'path'
import fs from 'fs'
import { OperatorBaserow } from '../common/baserow/operatorBaserow'
import { RawOperator } from './types/domain'
import { FileManager } from '../common/fileManager'

export class OperatorFeatures {
  private readonly __dirname = process.cwd()
  private readonly _outputFilePath: string = path.join(this.__dirname, './static/operators.json')
  private readonly _outputTypeFilePath: string = path.join(this.__dirname, './src/operators/types/generatedShared.ts')
  private readonly _schemaFilePath = path.join(this.__dirname, './schemas/program-with-publicodes-schema.json')
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
    const typeDeclaration = this.generateEnumDeclaration(filterOptions)
    FileManager.writeRaw(this._outputTypeFilePath, typeDeclaration, 'OperatorFilter type updated')
  }

  generateEnumDeclaration(data: string[]) {
    let declaration = `export enum OperatorFilter {\n`
    data.forEach((value, index) => {
      const formattedKey = this.toCamelCase(value)
      const formattedValue = value.includes("'") ? `"${value}"` : `'${value}'`

      if (index === data.length - 1) {
        declaration += `  ${formattedKey} = ${formattedValue}\n`
      } else {
        declaration += `  ${formattedKey} = ${formattedValue},\n`
      }
    })
    declaration += `}\n`
    return declaration
  }

  toCamelCase(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, (chr) => chr.toUpperCase())
  }
}
