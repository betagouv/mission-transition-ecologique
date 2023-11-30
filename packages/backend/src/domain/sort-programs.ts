import { ProgramAidType, ProgramData, TrackHelpValue } from '@tee/web/src/types'

export const sortPrograms = (
  programs: ProgramData[],
  questionnaireRoute: TrackHelpValue
): ProgramData[] => {
  const comparisonFun = (program1: ProgramData, program2: ProgramData) =>
    comparePrograms(program1, program2, questionnaireRoute)
  const sortedPrograms = programs.sort(comparisonFun)
  return sortedPrograms
}

const comparePrograms = (
  program1: ProgramData,
  program2: ProgramData,
  questionnaireRoute: TrackHelpValue
): number => {
  return Math.sign(
    getPriority(program1, questionnaireRoute) - getPriority(program2, questionnaireRoute)
  )
}

const getPriority = (prog: ProgramData, questionnaireRoute: TrackHelpValue): number => {
  switch (questionnaireRoute) {
    case TrackHelpValue.Unknown:
      if (isFreeCoaching(prog)) return 1
      if (isMaybeFreeCoaching(prog)) return 2
      if (hasType(ProgramAidType.acc, prog)) return 3
      if (hasType(ProgramAidType.fund, prog)) return 4
      if (hasType(ProgramAidType.loan, prog)) return 5
      if (hasType(ProgramAidType.tax, prog)) return 6
      return 7

    case TrackHelpValue.Precise:
      if (hasType(ProgramAidType.fund, prog)) return 1
      if (hasType(ProgramAidType.loan, prog)) return 2
      if (hasType(ProgramAidType.tax, prog)) return 3
      if (hasType(ProgramAidType.acc, prog)) return 4
      return 100
  }
}

const FREE_KEYWORD = 'gratuit'

const isFreeCoaching = (program: ProgramData) =>
  program["coût de l'accompagnement"]?.toLowerCase() == FREE_KEYWORD

const isMaybeFreeCoaching = (program: ProgramData) =>
  program["coût de l'accompagnement"]?.toLowerCase().includes(FREE_KEYWORD)

const hasType = (aidType: ProgramAidType, program: ProgramData) =>
  program["nature de l'aide"] == aidType
