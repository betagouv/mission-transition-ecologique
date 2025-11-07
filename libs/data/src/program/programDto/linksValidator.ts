import { LogLevel } from '../../common/logger/types'
import { LinkValidator } from '../../common/validators/linkValidator'
import { ProgramDto } from './programDto'

export async function validateExternalUrlLink(generator: ProgramDto): Promise<boolean> {
  if (generator.rawProgram['URL externe'] == '') {
    return false
  }
  if (!(await LinkValidator.isValidLink(generator.rawProgram['URL externe']))) {
    generator.logger.log(
      LogLevel.Minor,
      'Problème de validation du lien du champ URL externe',
      generator.rawProgram['Id fiche dispositif'],
      generator.rawProgram.id,
      `[Lien cassé](${generator.rawProgram['URL externe']})`
    )
    return true // we add the link even if he is detected faulty.
  }
  return true
}

export async function validateObjectiveLink(link: string, step: number, generator: ProgramDto) {
  if (!(await LinkValidator.isValidLink(link))) {
    generator.logger.log(
      LogLevel.Major,
      "Problème de validation d'un lien du champ étape " + step,
      generator.rawProgram['Id fiche dispositif'],
      generator.rawProgram.id,
      `[Lien cassé](${link})`
    )
  }
}
