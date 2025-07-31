import fs from 'fs'
import ConfigBaserow from '../../configBaserow'
import { AbstractBaserow } from './abstractBaserow'
import { ConditionalValues, Program } from './types'
import {
  DataProgram,
  Status,
  DataProgramType,
  Operator,
  GeographicCoverage,
  GeographicAreas,
  ConditionalValues as DomainConditionalValues
} from '../../program/types/domain'
import { Theme } from '../../theme/types/domain'
import { FileManager } from '../fileManager'

export class ProgramBaserow extends AbstractBaserow {
  private readonly _geographicCoverageTableId = ConfigBaserow.GEOGRAPHIC_COVERAGE_ID
  private readonly _programTableId = ConfigBaserow.PROGRAM_ID
  private readonly _conditionalValuesTableId = ConfigBaserow.CONDITIONAL_VALUES_ID
  private _operators: Operator[] = []
  private _geographicAreas: GeographicCoverage[] = []

  constructor() {
    super()
    this._operators = []
    this._geographicAreas = []
  }

  // Note : caching the downloaded data by default to nudge towards reducing the data transfer from baserow.
  async getPrograms(useLocalRawData: boolean): Promise<DataProgram[]> {
    if (useLocalRawData) {
      try {
        console.log('Using cached Baserow data')
        return FileManager.readJson<DataProgram[]>('program_tmp.json')
      } catch {
        console.log('Attempting to use cached baserow data but no cached data has been found.')
      }
    }

    const baserowPrograms = await this._getTableData<Program>(this._programTableId)
    const geographicCoverages = await this._getTableData<GeographicCoverage>(this._geographicCoverageTableId)
    const themes = await this._getTableData<Theme>(this._themeTableId)
    const conditionalValues = await this._getTableData<ConditionalValues>(this._conditionalValuesTableId)

    this._operators = await this._getTableData<Operator>(this._operatorTableId)
    this._geographicAreas = await this._getTableData<GeographicAreas>(this._geographicAreasTableId)

    const dataPrograms = baserowPrograms.map((baserowProgram) => this._convertToDataProgram(baserowProgram, geographicCoverages, themes))

    this._enrichDataProgramsWithConditionals(dataPrograms, conditionalValues)

    try {
      fs.writeFileSync('program_tmp.json', JSON.stringify(dataPrograms, null, 2))
      console.log(
        'All baserow relevant data has been cached.\nIf you are working on the code, you can and should use the cached data by calling getPrograms with true (in data/src/program/yamlGenerator/ProgramYamlGenerator.ts, line 25)\n'
      )
    } catch {
      // known empty bloc, comment for the linter!
    }

    return dataPrograms
  }

  private _convertToDataProgram(program: Program, geographicCoverages: GeographicCoverage[], themes: Theme[]): DataProgram {
    const {
      Statuts,
      "Nature de l'aide": aidTypes,
      'Opérateur de contact': contactOperator,
      'Autres opérateurs': otherOperator,
      'Couverture géographique': geographicCoverage,
      'Zones géographiques': programGeographicAreas,
      'Thèmes Ciblés': programThemes,
      'redirection-vers': redirectProgram,
      ...nonModifiedFields
    } = program

    const rawStatuts = Statuts.map(({ value }) => (Object.values(Status).includes(value as Status) ? (value as Status) : Status.Other))
    const domainContactOperator = this._replaceLinkObjectByTableData<Operator>(contactOperator, this._operators)
    const domainOtherOperator = this._replaceLinkObjectByTableData<Operator>(otherOperator, this._operators)
    const domainGeographicCoverage = this._replaceLinkObjectByTableData<GeographicCoverage>(geographicCoverage, geographicCoverages)
    const domainProgramGeographicAreas = this._replaceLinkObjectByTableData<GeographicAreas>(programGeographicAreas, this._geographicAreas)
    const domainProgramThemes = this._replaceLinkObjectByTableData<Theme>(programThemes, themes)
    const redirectsIds = redirectProgram.map((linkedObj) => linkedObj.id)

    const rawProgram: DataProgram = {
      ...nonModifiedFields,
      Statuts: rawStatuts,
      'Opérateur de contact': domainContactOperator,
      'Autres opérateurs': domainOtherOperator,
      "Nature de l'aide": aidTypes ? (aidTypes.value as DataProgramType) : DataProgramType.Undefined,
      'Zones géographiques': domainProgramGeographicAreas,
      'Couverture géographique': domainGeographicCoverage[0],
      'Thèmes Ciblés': domainProgramThemes,
      'redirection-vers': redirectsIds
    }

    return rawProgram
  }

  private _enrichDataProgramsWithConditionals(programs: DataProgram[], conditionalValues: ConditionalValues[]) {
    conditionalValues.forEach((conditionalValue) => {
      if (!conditionalValue['Dispositif concerné'].length) {
        // TODO ajouter logging
        return
      }
      const dataConditional = this._convertToDataConditionalValue(conditionalValue)
      const matchingProgram = programs.find((program) => program['Id fiche dispositif'] === dataConditional['Dispositif concerné'])
      if (matchingProgram) {
        if (!matchingProgram.conditionalData) {
          matchingProgram.conditionalData = []
        }
        matchingProgram.conditionalData.push(dataConditional)
      }
    })
  }

  private _convertToDataConditionalValue(conditionalValue: ConditionalValues): DomainConditionalValues {
    return {
      'Dispositif concerné': conditionalValue['Dispositif concerné'][0].value,
      'Type de condition': conditionalValue['Type de condition'].value as 'géographique' | 'nombre de salariés',
      'valeur de la condition géographique': this._replaceLinkObjectByTableData<GeographicAreas>(
        conditionalValue['valeur de la condition géographique'],
        this._geographicAreas
      ),
      'Condition: nb min salaries': conditionalValue['Condition: nb min salaries'],
      'Condition: nb max salaries': conditionalValue['Condition: nb max salaries'],
      'Opérateur de contact': this._replaceLinkObjectByTableData<Operator>(conditionalValue['Opérateur de contact'], this._operators),
      'Autres opérateurs': this._replaceLinkObjectByTableData<Operator>(conditionalValue['Autres opérateurs'], this._operators),
      'URL externe': conditionalValue['URL externe'],
      "Montant de l'aide ou coût": conditionalValue["Montant de l'aide ou coût"],
      "Durée de l'aide": conditionalValue["Durée de l'aide"],
      'Eligibilité taille': conditionalValue['Eligibilité taille'],
      'Eligibilité Spécifique': conditionalValue['Eligibilité Spécifique']
    }
  }
}
