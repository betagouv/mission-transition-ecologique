import type { ProgramData } from '@tee/web/src/types'
import { ProgramAidType } from '@tee/web/src/types'
import { QuestionnaireRoute } from '@tee/common/src/questionnaire/types'

// sorts the programs according to a "sortProfile", which currently
// only depends on the questionnaireRoute
export const sortPrograms = (programs: ProgramData[], sortProfile: QuestionnaireRoute): ProgramData[] => {
  return programs.sort((p1, p2) => comparePrograms(p1, p2, sortProfile))
}

const comparePrograms = (program1: ProgramData, program2: ProgramData, route: QuestionnaireRoute): number => {
  return Math.sign(getPriority(program1, route) - getPriority(program2, route))
}

const getPriority = (prog: ProgramData, route: QuestionnaireRoute): number => {
  switch (route) {
    case QuestionnaireRoute.NoSpecificGoal:
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

    case QuestionnaireRoute.SpecificGoal:
      switch (true) {
        case hasType(ProgramAidType.fund, prog):
          return 1
        case hasType(ProgramAidType.loan, prog):
          return 2
        case hasType(ProgramAidType.tax, prog):
          return 3
        case isCoachingOrTraining(prog) && !isMaybeFree(prog) && !isFree(prog):
          return 4
        case isCoachingOrTraining(prog) && isMaybeFree(prog) && !isFree(prog):
          return 5
        case isCoachingOrTraining(prog) && isFree(prog):
          return 6
        default:
          return 10
      }
  }
}

const hasType = (aidType: ProgramAidType, program: ProgramData) => program["nature de l'aide"] == aidType

const isFree = (program: ProgramData) => program["coût de l'accompagnement"]?.toLowerCase() == 'gratuit'

const isMaybeFree = (program: ProgramData) => program["coût de l'accompagnement"]?.toLowerCase().includes('gratuit')

const isCoachingOrTraining = (program: ProgramData) => hasType(ProgramAidType.acc, program) || hasType(ProgramAidType.train, program)
