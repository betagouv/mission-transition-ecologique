import { enrichedOperators } from '@/tools/operator'
import {
  FiltersKeys,
  FiltersType,
  OperatorFilter,
  ProgramAidType,
  ProgramEligibility,
  ProgramTypeForFront,
  Region,
  ThemeId,
  type ValueOf
} from '@/types'

export default class ProgramFilter {
  static byAidType(program: ProgramTypeForFront, programAidTypesSelected: ProgramAidType[]) {
    if (!this.isValidFilterValues(programAidTypesSelected)) {
      return true
    }

    return programAidTypesSelected.includes(program["nature de l'aide"] as ProgramAidType)
  }

  static byCompanyData(program: ProgramTypeForFront, companySelected: boolean) {
    if (companySelected) {
      return ProgramEligibility.isEligible(program as unknown as ProgramTypeForFront)
    }

    return true
  }

  static byRegion(program: ProgramTypeForFront, regionsSelected: Region[]) {
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

  static byOperator(program: ProgramTypeForFront, programOperatorsSelected: OperatorFilter[]) {
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

  static byTheme(program: ProgramTypeForFront, themeTypeSelected: ThemeId) {
    if (!this.isValidFilterValue(themeTypeSelected)) {
      return true
    }

    if (program.filters && program.filters[FiltersKeys.Theme]) {
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
