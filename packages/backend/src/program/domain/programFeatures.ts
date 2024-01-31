import { Program } from '@tee/data/src/type/program'
import { ProgramRepository } from './spi'

export default class ProgramFeatures {
  private _programRepository: ProgramRepository

  constructor(programRepository: ProgramRepository) {
    this._programRepository = programRepository
  }

  public getById(id: string): Program | undefined {
    return this._programRepository.getById(id)
  }
}
