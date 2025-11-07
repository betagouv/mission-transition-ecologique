import { jsonPrograms } from '../../../static'
import { DataProgram, Status } from '../types/domain'

export class ProgramUtils {
  public static isFlaggedForProd(program: DataProgram) {
    return program.Statuts.includes(Status.InProd) || program.Statuts.includes(Status.InProdNotAvailable)
  }

  public static isInProd(program: DataProgram): boolean {
    return this.isFlaggedForProd(program) && jsonPrograms.some((prodProgramData) => prodProgramData.id === program['Id fiche dispositif'])
  }
}
