import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { OperatorBaserow } from '../common/baserow/operatorBaserow'
import { RawOperator } from './types/domain'
import { FileManager } from '../common/fileManager'
import { readPrograms } from '../program/dataPipeline'

export class OperatorFeatures {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputFilePath: string = path.join(this.__dirname, '../../static/operators.json')
  private readonly _outputTypeFilePath: string = path.join(this.__dirname, './types/generatedShared.ts')
  private readonly _schemaFilePath = path.join(this.__dirname, '../../schemas/program-with-publicodes-schema.json')
  async updateOperatorsData() {
    const allOperators = await new OperatorBaserow().getAll()
    const programs = readPrograms(true)
    const programOperatorsNames = new Set<string>(
      programs.flatMap((program) => [
        program['opérateur de contact'],
        ...(Array.isArray(program['autres opérateurs']) ? program['autres opérateurs'] : [])
      ])
    )

    const programOperators = allOperators.filter((operator) => programOperatorsNames.has(operator.operator))

    FileManager.writeJson(this._outputFilePath, programOperators, 'operator.json updated')

    this._updateJsonSchema(programOperators)
    this._generateOperatorsFiltersCategoryType(programOperators)
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
