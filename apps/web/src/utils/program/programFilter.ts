import {
  ProgramAidType,
  Region,
  type ProgramType,
  type programFiltersType,
  type ValueOf,
  ThemeId,
  FiltersKeys,
  OperatorFilter
} from '@/types'
import { enrichedOperators } from '@tee/data/static'

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

  static byOperator(program: ProgramType, programOperatorsSelected: OperatorFilter[]) {
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
