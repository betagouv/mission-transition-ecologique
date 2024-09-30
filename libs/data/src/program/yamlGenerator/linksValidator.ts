import { LogLevel } from '../../common/logger/types'
import { LinkValidator } from '../../common/validators/linkValidator'
import { CoreGenerator } from './coreGenerator'

export async function validateExternalUrlLink(generator: CoreGenerator): Promise<boolean> {
  if (generator.program['URL externe'] == '') {
    return false
  }
  if (!(await LinkValidator.isValidLink(generator.program['URL externe']))) {
    generator.logger.log(
      LogLevel.Minor,
      'Problème de validation du lien du champ URL externe',
      generator.program['Id fiche dispositif'],
      generator.program.id,
      `[Lien cassé](${generator.program['URL externe']})`
    )
    return true // we add the link even if he is detected faulty.
  }
  return true
}

export async function validateObjectiveLink(link: string, step: number, generator: CoreGenerator) {
  if (!(await LinkValidator.isValidLink(link))) {
    generator.logger.log(
      LogLevel.Major,
      "Problème de validation d'un lien du champ étape " + step,
      generator.program['Id fiche dispositif'],
      generator.program.id,
      `[Lien cassé](${link})`
    )
  }
}
