import { ExternalProgramType } from '@tee/data'
import { Result } from 'true-myth'
import { ExternalProgramRepository } from './spi'
import { ExternalProgramNotFoundError } from './types'

export default class ExternalProgramFeatures {
  constructor(private readonly _externalProgramRepository: ExternalProgramRepository) {}

  getAll(): ExternalProgramType[] {
    return this._externalProgramRepository.getAll()
  }

  getOneById(id: string): Result<ExternalProgramType, ExternalProgramNotFoundError> {
    const program = this._externalProgramRepository.getById(id)

    if (!program) {
      return Result.err(new ExternalProgramNotFoundError(id))
    }

    return Result.ok(program)
  }
}
