import fs from 'fs'
import { AbstractBaserow } from './abstractBaserow'
import { Program } from './types'
import { DataProgram, Status, DataProgramType, Operator, GeographicCoverage, GeographicAreas } from '../../program/types/domain'
import { Theme } from '../../theme/types/domain'

export class ProgramBaserow extends AbstractBaserow {
  private readonly _operatorTableId = 314410
  private readonly _geographicCoverageTableId = 314470
  private readonly _geographicAreasTableId = 314474
  private readonly _programTableId = 314437

  // Note : caching the downloaded data by default to nudge towards reducing the data transfer from baserow.
  async getPrograms(useLocalRawData: boolean): Promise<DataProgram[]> {
    if (useLocalRawData) {
      try {
        const data = fs.readFileSync('program_tmp.json', 'utf-8')
        console.log('Using cached Baserow data')
        return JSON.parse(data) as DataProgram[]
      } catch {
        console.log('Attempting to use cached baserow data but no cached data has been found.')
      }
    }

    const baserowPrograms = await this._getTableData<Program>(this._programTableId)
    const operators = await this._getTableData<Operator>(this._operatorTableId)
    const geographicCoverages = await this._getTableData<GeographicCoverage>(this._geographicCoverageTableId)
    const geographicAreas = await this._getTableData<GeographicAreas>(this._geographicAreasTableId)
    const themes = await this._getTableData<Theme>(this._themeTableId)

    const dataPrograms = baserowPrograms.map((baserowProgram) =>
      this._convertToDataProgram(baserowProgram, operators, geographicCoverages, geographicAreas, themes)
    )

    try {
      fs.writeFileSync('program_tmp.json', JSON.stringify(dataPrograms, null, 2))
      console.log(
        'All baserow relevant data has been cached.\nIf you are working on the code, you can and should use the cached data by calling getPrograms with true (in ProgramYamlGenerator.ts, line 14'
      )
    } catch {
      // known empty bloc, comment for the linter!
    }

    return dataPrograms
  }

  private _convertToDataProgram(
    program: Program,
    operators: Operator[],
    geographicCoverages: GeographicCoverage[],
    geographicAreas: GeographicAreas[],
    themes: Theme[]
  ): DataProgram {
    const {
      Statuts,
      "Nature de l'aide": aidTypes,
      'Opérateur de contact': contactOperator,
      'Autres opérateurs': otherOperator,
      'Couverture géographique': geographicCoverage,
      'Zones géographiques': programGeographicAreas,
      'Thèmes Ciblés': programThemes,
      ...nonModifiedFields
    } = program

    const rawStatuts = Statuts.map((linkedObj) => linkedObj.value as Status)
    const domainContactOperator = this._replaceLinkObjectByTableData<Operator>(contactOperator, operators)
    const domainOtherOperator = this._replaceLinkObjectByTableData<Operator>(otherOperator, operators)
    const domainGeographicCoverage = this._replaceLinkObjectByTableData<GeographicCoverage>(geographicCoverage, geographicCoverages)
    const domainProgramGeographicAreas = this._replaceLinkObjectByTableData<GeographicAreas>(programGeographicAreas, geographicAreas)
    const domainProgramThemes = this._replaceLinkObjectByTableData<Theme>(programThemes, themes)

    const rawProgram: DataProgram = {
      ...nonModifiedFields,
      Statuts: rawStatuts,
      'Opérateur de contact': domainContactOperator,
      'Autres opérateurs': domainOtherOperator,
      "Nature de l'aide": aidTypes ? (aidTypes.value as DataProgramType) : DataProgramType.Undefined,
      'Zones géographiques': domainProgramGeographicAreas,
      'Couverture géographique': domainGeographicCoverage[0],
      'Thèmes Ciblés': domainProgramThemes
    }

    return rawProgram
  }
}
