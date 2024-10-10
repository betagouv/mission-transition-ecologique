import { ProgramAidType, Region, type ProgramData, type programFiltersType, type ValueOf, ThemeId, FiltersKeys } from '@/types'
import { enrichedOperators } from '@tee/data/static'

export default class ProgramFilter {
  static byAidType(program: ProgramData, programAidTypesSelected: ProgramAidType[]) {
    if (!this.isValidFilterValues(programAidTypesSelected)) {
      return true
    }

    return programAidTypesSelected.includes(program["nature de l'aide"])
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

  static byOperator(program: ProgramData, programOperatorsSelected: string[]) {
    if (!this.isValidFilterValues(programOperatorsSelected)) {
      return true
    }

    const allProgramOperators = [program['opérateur de contact'], ...(program['autres opérateurs'] || [])]

    for (const programOperator of allProgramOperators) {
      const matchingOperator = enrichedOperators.find((enrichedOperator) => enrichedOperator.operator === programOperator)
      if (!matchingOperator) {
        continue
      }

      const { filterCategories } = matchingOperator
      const hasMatch = filterCategories.some((category) => programOperatorsSelected.includes(category))
      if (hasMatch) {
        return true
      }
    }
    return false
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
