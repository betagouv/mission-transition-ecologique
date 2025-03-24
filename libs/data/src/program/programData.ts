import { DataProgram, Status } from './types/domain'

export class ProgramDataUtils {
  public static isInProd(program: DataProgram) {
    return program.Statuts.includes(Status.InProd) || program.Statuts.includes(Status.InProdNotAvailable)
  }
}
