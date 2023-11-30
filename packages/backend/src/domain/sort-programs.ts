import { ProgramAidType, ProgramData } from '@tee/web/src/types'

export const sortPrograms = (programs: ProgramData[]): ProgramData[] => {
  const sortedPrograms = programs.sort(comparePrograms)
  return sortedPrograms
}

const comparePrograms = (program1: ProgramData, program2: ProgramData): number => {
  return Math.sign(getPriority(program1) - getPriority(program2))
}

const getPriority = (program: ProgramData): number => {
  if (isFreeCoaching(program)) return 1
  if (isMaybeFreeCoaching(program)) return 2
  if (isCoaching(program)) return 3
  if (isFunding(program)) return 4
  return 100
}

const FREE_KEYWORD = 'gratuit'

const isFreeCoaching = (program: ProgramData) =>
  program["coût de l'accompagnement"]?.toLowerCase() == FREE_KEYWORD

const isMaybeFreeCoaching = (program: ProgramData) =>
  program["coût de l'accompagnement"]?.toLowerCase().includes(FREE_KEYWORD)

const isCoaching = (program: ProgramData) => program["nature de l'aide"] == ProgramAidType.acc

const isFunding = (program: ProgramData) => program["nature de l'aide"] == ProgramAidType.fund
