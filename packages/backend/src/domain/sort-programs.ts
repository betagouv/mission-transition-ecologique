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
  return 2
}

const isFreeCoaching = (program: ProgramData) =>
  program["coût de l'accompagnement"]?.toLowerCase() == 'gratuit'
