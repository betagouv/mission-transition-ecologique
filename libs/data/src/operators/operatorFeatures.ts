import path from 'path'
import fs from 'fs'
import { OperatorBaserow } from '../common/baserow/operatorBaserow'
import { EnrichedOperator } from './types/shared'

export class OperatorFeatures {
  private readonly _outputDirectory: string = path.join(__dirname, '../../static/')
  async createOperatorsJson() {
    const operators = await new OperatorBaserow().getAll()
    this._writeJson(operators)
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
}
