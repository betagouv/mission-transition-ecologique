import ProgramFeatures from '../domain/programFeatures'
import ProgramsJson from '../infrastructure/programsJson'

export default class ProgramService {
  private _program: ProgramFeatures

  constructor() {
    this._program = new ProgramFeatures(ProgramsJson.getInstance())
  }

  public getById(id: string) {
    return this._program.getById(id)
  }
}
