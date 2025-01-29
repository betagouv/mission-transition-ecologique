import {
  FilterItemKeys,
  FiltersKeys,
  FiltersType,
  OperatorFilter,
  ProgramAidType,
  type ProgramData,
  ProgramEligibility,
  ProgramType,
  Region,
  ThemeId,
  type ValueOf
} from '@/types'
import { enrichedOperators } from '@tee/data/static'
import { useFiltersStore } from '@/stores/filters'

export default class ProgramFilter {
  static byAidType(program: ProgramData, programAidTypesSelected: ProgramAidType[]) {
    if (!this.isValidFilterValues(programAidTypesSelected)) {
      return true
    }

    return programAidTypesSelected.includes(program["nature de l'aide"])
  }

  static byCompanyData(program: ProgramData, companySelected: boolean) {
    if (!this.isValidFilterValue(companySelected)) {
      return true
    }

    if (companySelected) {
      useFiltersStore().resetFilter(FilterItemKeys.regionAid)
      return ProgramEligibility.isEligible(program as unknown as ProgramType)
    }

    return true
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

  static byOperator(program: ProgramData, programOperatorsSelected: OperatorFilter[]) {
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

  static isValidFilterValue(filterValue: ValueOf<FiltersType>) {
    return filterValue !== ''
  }

  static isValidFilterValues(filterValue: ValueOf<FiltersType>) {
    return Array.isArray(filterValue) && filterValue.length > 0
  }
}
