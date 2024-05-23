import {
  PublicodesKeys,
  PublicodeObjective,
  ProgramAidType,
  Regions,
  ProgramOperatorType,
  type ProgramData,
  type programFiltersType,
  PublicodesCondition,
  type ValueOf
} from '@/types'

export default class ProgramFilter {
  static filterProgramsByAidType(program: ProgramData, programAidTypesSelected: ProgramAidType[]) {
    if (!this.isValidFilterValues(programAidTypesSelected)) {
      return true
    }
    return programAidTypesSelected.includes(program["nature de l'aide"])
  }
  static filterProgramsByRegion(program: ProgramData, regionsSelected: Regions[]) {
    console.log(regionsSelected, program["conditions d'éligibilité"]['secteur géographique'])
    if (!this.isValidFilterValues(regionsSelected)) {
      return true
    }
    if ()
    return true
  }

  static filterProgramsByOperator(program: ProgramData, programOperatorsSelected: ProgramOperatorType[]) {
    if (!this.isValidFilterValues(programOperatorsSelected)) {
      return true
    }
    return programOperatorsSelected.includes(program['opérateur de contact'])
  }

  static filterProgramsByObjective(program: ProgramData, objectiveTypeSelected: PublicodeObjective) {
    if (!this.isValidFilterValue(objectiveTypeSelected)) {
      return true
    }

    if (program.publicodes[PublicodesKeys.hasObjective]) {
      return program.publicodes[PublicodesKeys.hasObjective][PublicodesCondition.oneOfThese].includes(objectiveTypeSelected)
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
