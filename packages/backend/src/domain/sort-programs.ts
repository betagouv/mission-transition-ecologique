import { ProgramData } from '@tee/web/src/types'

export const sortPrograms = (programs: ProgramData[]): ProgramData[] => {
  const sortedPrograms = programs.sort((prog1, prog2) => {
    if (
      prog1["coût de l'accompagnement"] == 'gratuit' &&
      prog2["coût de l'accompagnement"] != 'gratuit'
    )
      return -1
    if (
      prog1["coût de l'accompagnement"] != 'gratuit' &&
      prog2["coût de l'accompagnement"] == 'gratuit'
    )
      return 1
    return 0
  })
  return sortedPrograms
}
