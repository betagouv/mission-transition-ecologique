import { DataProgram, Status } from './types/domain'

export class ProgramUtils {
  public static isInProd(program: DataProgram) {
    return program.Statuts.includes(Status.InProd) || program.Statuts.includes(Status.InProdNotAvailable)
  }
}
