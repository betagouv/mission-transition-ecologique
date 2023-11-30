import { ProgramAidType, ProgramData, TrackHelpValue } from '@tee/web/src/types'

export const sortPrograms = (
  programs: ProgramData[],
  questionnaireRoute: TrackHelpValue
): ProgramData[] => {
  return programs.sort((p1, p2) => comparePrograms(p1, p2, questionnaireRoute))
}

const comparePrograms = (
  program1: ProgramData,
  program2: ProgramData,
  route: TrackHelpValue
): number => {
  return Math.sign(getPriority(program1, route) - getPriority(program2, route))
}

const getPriority = (prog: ProgramData, route: TrackHelpValue): number => {
  switch (route) {
    case TrackHelpValue.Unknown:
      if (isFreeCoaching(prog)) return 1
      if (isMaybeFreeCoaching(prog)) return 2
      if (hasType(ProgramAidType.acc, prog)) return 3
      if (hasType(ProgramAidType.train, prog)) return 4
      if (hasType(ProgramAidType.fund, prog)) return 5
      if (hasType(ProgramAidType.loan, prog)) return 6
      if (hasType(ProgramAidType.tax, prog)) return 7
      return 10

    case TrackHelpValue.Precise:
      if (isFreeCoaching(prog)) return 7
      if (isMaybeFreeCoaching(prog)) return 6
      if (hasType(ProgramAidType.acc, prog)) return 5
      if (hasType(ProgramAidType.train, prog)) return 4
      if (hasType(ProgramAidType.tax, prog)) return 3
      if (hasType(ProgramAidType.loan, prog)) return 2
      if (hasType(ProgramAidType.fund, prog)) return 1
      return 10
  }
}

const FREE_KEYWORD = 'gratuit'

const isFreeCoaching = (program: ProgramData) =>
  program["coût de l'accompagnement"]?.toLowerCase() == FREE_KEYWORD

const isMaybeFreeCoaching = (program: ProgramData) =>
  program["coût de l'accompagnement"]?.toLowerCase().includes(FREE_KEYWORD)

const hasType = (aidType: ProgramAidType, program: ProgramData) =>
  program["nature de l'aide"] == aidType
