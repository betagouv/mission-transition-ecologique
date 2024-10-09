import {
  ProgramAidType,
  Region,
  ProgramOperatorType,
  type programFiltersType,
  type ValueOf,
  ThemeId,
  FiltersKeys,
  ProgramType
} from '@/types'

export default class ProgramFilter {
  static byAidType(program: ProgramType, programAidTypesSelected: ProgramAidType[]) {
    if (!this.isValidFilterValues(programAidTypesSelected)) {
      return true
    }

    return programAidTypesSelected.includes(program["nature de l'aide"] as ProgramAidType)
  }

  static byRegion(program: ProgramType, regionsSelected: Region[]) {
    if (!this.isValidFilterValues(regionsSelected)) {
      return true
    }
    const geoSectors = (program["conditions d'éligibilité"] as { [k: string]: string[] })['secteur géographique']
      .map((regionString: string) => regionString.split(', '))
      .flat()

    if (geoSectors.includes("France et territoires d'outre-mer")) {
      return true
    }
    const matchingRegions = regionsSelected.filter((regionString: Region) => geoSectors.includes(regionString))

    return matchingRegions.length > 0
  }

  static byOperator(program: ProgramType, programOperatorsSelected: ProgramOperatorType[]) {
    if (!this.isValidFilterValues(programOperatorsSelected)) {
      return true
    }
    const matchingOperators = programOperatorsSelected.filter((operator: ProgramOperatorType) =>
      program['opérateur de contact'].includes(operator)
    )

    return matchingOperators.length > 0
  }

  static byTheme(program: ProgramType, themeTypeSelected: ThemeId) {
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
