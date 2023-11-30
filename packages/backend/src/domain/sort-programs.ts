import { ProgramData } from '@tee/web/src/types'

export const sortPrograms = (programs: ProgramData[]): ProgramData[] => {
  const sortedPrograms = programs.sort(comparePrograms)
  return sortedPrograms
}

const comparePrograms = (program1: ProgramData, program2: ProgramData): number => {
  return Math.sign(getPriority(program1) - getPriority(program2))
}

const getPriority = (program: ProgramData): number => {
  if (program["coût de l'accompagnement"] == 'gratuit') return 1
  return 2
}
