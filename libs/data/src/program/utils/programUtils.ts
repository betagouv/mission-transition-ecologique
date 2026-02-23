import { jsonPrograms } from '../../../static'
import { DataProgram, Status } from '../types/domain'
import { ProgramTechnicalInfo } from '../../common/baserow/types'

export class ProgramUtils {
  public static isFlaggedForProd(program: DataProgram) {
    return program.Statuts.includes(Status.InProd) || program.Statuts.includes(Status.InProdNotAvailable)
  }

  public static hasBeenInProd(program: DataProgram): boolean {
    if (!program.Statuts.includes(Status.Archived)) {
      return false
    }

    try {
      const techInfo: ProgramTechnicalInfo = JSON.parse(program.tech || '{}')
      return !!techInfo.prod_release_date
    } catch {
      return false
    }
  }

  public static isInProd(program: DataProgram): boolean {
    return this.isFlaggedForProd(program) && jsonPrograms.some((prodProgramData) => prodProgramData.id === program['Id fiche dispositif'])
  }
}
