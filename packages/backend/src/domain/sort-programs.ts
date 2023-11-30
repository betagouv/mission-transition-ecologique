import { ProgramData } from '@tee/web/src/types'

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
  return 3
}

const isFreeCoaching = (program: ProgramData) =>
  program["coût de l'accompagnement"]?.toLowerCase() == 'gratuit'

const isMaybeFreeCoaching = (program: ProgramData) =>
  program["coût de l'accompagnement"]?.includes('gratuit')
