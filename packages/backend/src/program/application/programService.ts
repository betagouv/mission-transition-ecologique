import Program from '../domain/program'
import ProgramsJson from '../infrastructure/programsJson'

export default class ProgramService {
  private _program: Program

  constructor() {
    this._program = new Program(ProgramsJson.getInstance())
  }

  public getById(id: string) {
    return this._program.getById(id)
  }
}
