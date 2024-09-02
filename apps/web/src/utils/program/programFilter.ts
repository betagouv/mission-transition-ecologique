import {
  PublicodesKeys,
  ProgramAidType,
  Region,
  ProgramOperatorType,
  type programFiltersType,
  PublicodesCondition,
  type ValueOf,
  Objective,
  ProgramType
} from '@/types'
import { Theme } from '@/utils/theme'

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
    const geoSectors = program["conditions d'éligibilité"]['secteur géographique']
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

  static byObjective(program: ProgramType, objectiveTypeSelected: Objective) {
    if (!this.isValidFilterValue(objectiveTypeSelected)) {
      return true
    }

    const publicodeObjective = Theme.getPublicodeObjectiveByObjective(objectiveTypeSelected)

    if (program.publicodes[PublicodesKeys.hasObjective] && publicodeObjective) {
      return program.publicodes[PublicodesKeys.hasObjective][PublicodesCondition.oneOfThese]?.includes(publicodeObjective)
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
