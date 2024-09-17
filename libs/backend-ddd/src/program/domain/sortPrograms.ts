import { ProgramTypeWithPublicode, ProgramAidType } from '@tee/data'
import { QuestionnaireRoute } from '@tee/common'

// sorts the programs according to a "sortProfile", which currently
// only depends on the questionnaireRoute
export const sortPrograms = (programs: ProgramTypeWithPublicode[], sortProfile: QuestionnaireRoute): ProgramTypeWithPublicode[] => {
  programs.sort((p1, p2) => compareProgramsByType(p1, p2, sortProfile))
  if (sortProfile == QuestionnaireRoute.SpecificGoal) {
    programs.sort((p1, p2) => compareProgramsByObjectiveNumber(p1, p2))
  }
  return programs
}

const compareProgramsByObjectiveNumber = (program1: ProgramTypeWithPublicode, program2: ProgramTypeWithPublicode): number => {
  return Math.sign(objectifsNumber(program1) - objectifsNumber(program2))
}

const compareProgramsByType = (
  program1: ProgramTypeWithPublicode,
  program2: ProgramTypeWithPublicode,
  route: QuestionnaireRoute
): number => {
  return Math.sign(getTypePriority(program1, route) - getTypePriority(program2, route))
}

const getTypePriority = (prog: ProgramTypeWithPublicode, route: QuestionnaireRoute): number => {
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

const hasType = (aidType: ProgramAidType, program: ProgramTypeWithPublicode) => program["nature de l'aide"] == aidType

const isFree = (program: ProgramTypeWithPublicode) => program["coût de l'accompagnement"]?.toLowerCase() == 'gratuit'

const isMaybeFree = (program: ProgramTypeWithPublicode) => program["coût de l'accompagnement"]?.toLowerCase().includes('gratuit')

const isCoachingOrTraining = (program: ProgramTypeWithPublicode) =>
  hasType(ProgramAidType.study, program) || hasType(ProgramAidType.train, program)

const objectifsNumber = (program: ProgramTypeWithPublicode) => {
  if (
    program['publicodes']['entreprise . a un objectif ciblé'] &&
    program['publicodes']['entreprise . a un objectif ciblé']['une de ces conditions']
  )
    return program['publicodes']['entreprise . a un objectif ciblé']['une de ces conditions'].length
  else {
    return 1000
  }
}
