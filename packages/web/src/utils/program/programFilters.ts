import {
  PublicodesKeys,
  PublicodeObjective,
  ProgramAidType,
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
