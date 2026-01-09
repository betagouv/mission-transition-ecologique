import { ProgramType } from '@tee/data'
import { Result } from 'true-myth'
import ExternalProgramsJson from '../infrastructure/externalProgramsJson'
import ExternalProgramFeatures from '../domain/externalProgramFeatures'
import { ExternalProgramNotFoundError } from '../domain/types'

export default class ExternalProgramService {
  private readonly _externalProgram: ExternalProgramFeatures

  constructor() {
    const externalProgramRepository = ExternalProgramsJson.getInstance()
    this._externalProgram = new ExternalProgramFeatures(externalProgramRepository)
  }

  getAll(): ExternalProgramType[] {
    return this._externalProgram.getAll()
  }

  getById(id: string): Result<ExternalProgramType, ExternalProgramNotFoundError> {
    return this._externalProgram.getOneById(id)
  }
}
