import { Program } from '@tee/data/src/type/program'

export type CurrentDateService = {
  get: () => string // fr-FR formated, e.g. "20/12/2023"
}

export interface ProgramRepository {
  programs: Program[]
  getById: (id: string) => Program | undefined
}
