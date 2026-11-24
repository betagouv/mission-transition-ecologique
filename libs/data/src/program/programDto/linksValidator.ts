import { LogLevel } from '../../common/logger/types'
import { LinkValidator } from '../../common/validators/linkValidator'
import { ProgramDto } from './programDto'

export async function validateExternalUrlLink(generator: ProgramDto): Promise<boolean> {
  const link = generator.rawProgram['URL externe']
  if (link == '') {
    return false
  }
  // we add the link even if it is detected faulty.
  await validateProgramLink(link, LogLevel.Minor, 'URL externe', generator)
  return true
}

export async function validateObjectiveLink(link: string, step: number, generator: ProgramDto) {
  await validateProgramLink(link, LogLevel.Major, 'étape ' + step, generator)
}

export async function validateProgramLink(link: string, brokenLevel: LogLevel, field: string, generator: ProgramDto) {
  const check = await LinkValidator.check(link)
  LinkValidator.logLinkStatus(check, {
    logger: generator.logger,
    brokenLevel,
    field,
    id: generator.rawProgram['Id fiche dispositif'],
    rowId: generator.rawProgram.id
  })
}
