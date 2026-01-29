import { ProgramBaserow } from '../../common/baserow/programBaserow'
import { Logger } from '../../common/logger/logger'
import { LoggerType } from '../../common/logger/types'
import { ProgramUtils } from '../utils/programUtils'
import { ProgramDto } from './programDto'
import Redirect from '../../common/redirect/redirect'
import { Status } from '../types/domain'
import { ProgramStaticBaseType } from '../types/shared'

export class ProgramUpdater {
  private _logger = new Logger(LoggerType.Program)

  async getProcessedProgramsAndGenerateRedirects(): Promise<ProgramStaticBaseType[]> {
    const programs = await new ProgramBaserow().getPrograms(false)
    const validPrograms: ProgramStaticBaseType[] = []

    for (const program of programs) {
      if (ProgramUtils.isFlaggedForProd(program) || ProgramUtils.hasBeenInProd(program)) {
        const generator = new ProgramDto(program, this._logger)
        await generator.process()
        if (generator.valid) {
          validPrograms.push(generator.programData as ProgramStaticBaseType)
        }
      }
    }

    const redirectWatched = programs.filter((p) => ProgramUtils.isFlaggedForProd(p) || p.Statuts.includes(Status.Replaced))
    new Redirect(this._logger).updateProgramRedirects(redirectWatched)
    this._logger.write('programYaml.log')

    return validPrograms
  }
}
