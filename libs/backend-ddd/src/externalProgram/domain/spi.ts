import { ExternalProgramType } from '@tee/data'

export interface ExternalProgramRepository {
  getAll(): ExternalProgramType[]
  getById(id: string): ExternalProgramType | undefined
}
