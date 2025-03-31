import { ProgramTypeWithEligibility, ProgramAidType } from '@tee/data'

export const sortPrograms = (programs: ProgramTypeWithEligibility[]): ProgramTypeWithEligibility[] => {
  programs.sort((p1, p2) => compareProgramsByType(p1, p2))
  return programs
}

const compareProgramsByType = (program1: ProgramTypeWithEligibility, program2: ProgramTypeWithEligibility): number => {
  return Math.sign(getTypePriority(program1) - getTypePriority(program2))
}

const getTypePriority = (prog: ProgramTypeWithEligibility): number => {
  switch (true) {
    case isCoachingOrTraining(prog) && isFree(prog):
      return 1
    case isCoachingOrTraining(prog) && isMaybeFree(prog):
      return 2
    case isCoachingOrTraining(prog):
      return 3
    case hasType(ProgramAidType.fund, prog):
      return 4
    case hasType(ProgramAidType.loan, prog):
      return 5
    case hasType(ProgramAidType.tax, prog):
      return 6
    default:
      return 10
  }
}

const hasType = (aidType: ProgramAidType, program: ProgramTypeWithEligibility) => program["nature de l'aide"] == aidType

const isFree = (program: ProgramTypeWithEligibility) => program["coût de l'accompagnement"]?.toLowerCase() == 'gratuit'

const isMaybeFree = (program: ProgramTypeWithEligibility) => program["coût de l'accompagnement"]?.toLowerCase().includes('gratuit')

const isCoachingOrTraining = (program: ProgramTypeWithEligibility) =>
  hasType(ProgramAidType.study, program) || hasType(ProgramAidType.train, program)
