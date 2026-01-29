import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { ImageBaserow } from '../common/baserow/imageBaserow'
import { OperatorBaserow } from '../common/baserow/operatorBaserow'
import { LoggerInterface } from '../common/logger/types'
import { Operator } from './types/domain'
import { FileManager } from '../common/fileManager'
import { jsonPrograms } from '../../static'
import { ProgramType } from '../program/types/shared'

export class OperatorFeatures {
  private readonly _dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputDirPath: string = path.join(this._dirname, '../../../../apps/nuxt/src/public/json/operator/')
  private readonly _outputFileName: string = 'operators.json'
  private readonly _outputTypeFilePath: string = path.join(this._dirname, './types/generatedShared.ts')
  private readonly _schemaFilePath = path.join(this._dirname, '../../schemas/program-with-publicodes-schema.json')

  constructor(
    private _imageDownloader: ImageBaserow,
    private _logger: LoggerInterface
  ) {}

  async updateOperatorsData() {
    const allOperators = await new OperatorBaserow(this._imageDownloader, this._logger).getAll()
    const programs = jsonPrograms as unknown as ProgramType[]
    const programOperatorsNames = new Set<string>(
      programs.flatMap((program) => [
        program['opérateur de contact'],
        ...(Array.isArray(program['autres opérateurs']) ? program['autres opérateurs'] : [])
      ])
    )

    const programOperators = allOperators.filter((operator) => programOperatorsNames.has(operator.name))

    this._updateJson(programOperators)
    this._updateJsonSchema(programOperators)
    this._generateOperatorsFiltersCategoryType(programOperators)
  }

  private _updateJson(programOperators: Operator[]) {
    const jsonOperators = programOperators.map((operators) => ({
      operator: operators.name,
      filterCategories: operators.filterCategories,
      imagePath: operators.imagePath,
      color: operators.color
    }))

    FileManager.createFolderIfNotExists(this._outputDirPath)
    FileManager.writeJson(this._outputDirPath + this._outputFileName, jsonOperators, 'operator.json updated')
  }

  private _updateJsonSchema(operators: Operator[]) {
    const schema = JSON.parse(fs.readFileSync(this._schemaFilePath, 'utf-8'))
    const operatorsName = operators.map((operator) => operator.name)

    if (schema.$defs && schema.$defs.operators) {
      schema.$defs.operators.enum = operatorsName

      FileManager.writeJson(this._schemaFilePath, schema, 'Field operator of the jsonSchema updated')
    }
  }

  private _generateOperatorsFiltersCategoryType(operators: Operator[]) {
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
