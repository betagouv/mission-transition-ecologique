import { ProgramRepository } from './spi'

export default class Program {
  private _programRepository: ProgramRepository

  constructor(programRepository: ProgramRepository) {
    this._programRepository = programRepository
  }

  public getById(id: string) {
    return this._programRepository.getById(id)
  }
}
