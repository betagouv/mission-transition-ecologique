import {
  ProgramAidType,
  Region,
  ProgramOperatorType,
  type ProgramData,
  type programFiltersType,
  type ValueOf,
  ThemeId,
  FiltersKeys
} from '@/types'

export default class ProgramFilter {
  static byAidType(program: ProgramData, programAidTypesSelected: ProgramAidType[]) {
    if (!this.isValidFilterValues(programAidTypesSelected)) {
      return true
    }

    return programAidTypesSelected.includes(program["nature de l'aide"] as ProgramAidType)
  }

  static byRegion(program: ProgramData, regionsSelected: Region[]) {
    if (!this.isValidFilterValues(regionsSelected)) {
      return true
    }
    const geoSectors = program["conditions d'éligibilité"]['secteur géographique']
      .map((regionString: string) => regionString.split(', '))
      .flat()

    if (geoSectors.includes("France et territoires d'outre-mer")) {
      return true
    }
    const matchingRegions = regionsSelected.filter((regionString: Region) => geoSectors.includes(regionString))

    return matchingRegions.length > 0
  }

  static byOperator(program: ProgramData, programOperatorsSelected: ProgramOperatorType[]) {
    if (!this.isValidFilterValues(programOperatorsSelected)) {
      return true
    }
    const matchingOperators = programOperatorsSelected.filter((operator: ProgramOperatorType) =>
      program['opérateur de contact'].includes(operator)
    )

    return matchingOperators.length > 0
  }

  static byTheme(program: ProgramData, themeTypeSelected: ThemeId) {
    if (!this.isValidFilterValue(themeTypeSelected)) {
      return true
    }

    if (program.filters[FiltersKeys.Theme]) {
      return program.filters[FiltersKeys.Theme].includes(themeTypeSelected)
    }

    return true
  }

  static isValidFilterValue(programFilterValue: ValueOf<programFiltersType>) {
    return programFilterValue !== ''
  }

  static isValidFilterValues(programFilterValue: ValueOf<programFiltersType>) {
    return programFilterValue.length > 0
  }
}
