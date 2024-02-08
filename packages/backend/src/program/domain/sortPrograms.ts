import { ProgramAidType, TrackHelpValue } from '@tee/web/src/types'
import { Program } from './types'

// sorts the programs according to a "sortProfile", which currently
// only depends on the questionnaireRoute
export const sortPrograms = (programs: Program[], sortProfile: TrackHelpValue): Program[] => {
  return programs.sort((p1, p2) => comparePrograms(p1, p2, sortProfile))
}

const comparePrograms = (program1: Program, program2: Program, route: TrackHelpValue): number => {
  return Math.sign(getPriority(program1, route) - getPriority(program2, route))
}

const getPriority = (prog: Program, route: TrackHelpValue): number => {
  switch (route) {
    case TrackHelpValue.Unknown:
      if (isCoachingOrTraining(prog) && isFree(prog)) return 1
      if (isCoachingOrTraining(prog) && isMaybeFree(prog)) return 2
      if (isCoachingOrTraining(prog)) return 3
      if (hasType(ProgramAidType.fund, prog)) return 4
      if (hasType(ProgramAidType.loan, prog)) return 5
      if (hasType(ProgramAidType.tax, prog)) return 6
      return 10

    case TrackHelpValue.Precise:
      if (hasType(ProgramAidType.fund, prog)) return 1
      if (hasType(ProgramAidType.loan, prog)) return 2
      if (hasType(ProgramAidType.tax, prog)) return 3
      if (isCoachingOrTraining(prog) && !isMaybeFree(prog) && !isFree(prog)) return 4
      if (isCoachingOrTraining(prog) && isMaybeFree(prog) && !isFree(prog)) return 5
      if (isCoachingOrTraining(prog) && isFree(prog)) return 6
      return 10
  }
}

const hasType = (aidType: ProgramAidType, program: Program) => program["nature de l'aide"] == aidType

const isFree = (program: Program) => program["coût de l'accompagnement"]?.toLowerCase() == 'gratuit'

const isMaybeFree = (program: Program) => program["coût de l'accompagnement"]?.toLowerCase().includes('gratuit')

const isCoachingOrTraining = (program: Program) => hasType(ProgramAidType.acc, program) || hasType(ProgramAidType.train, program)
