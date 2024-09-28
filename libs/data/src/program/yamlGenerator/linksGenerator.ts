import { LogLevel } from '../../common/logger/types'
import { LinkValidator } from '../../common/validators/linkValidators'
import { CoreGenerator } from './coreGenerator'

export async function validateExternalUrlLink(generator: CoreGenerator): Promise<boolean> {
  if (generator.program['URL externe'] == '') {
    return false
  }
  if (!(await LinkValidator.isValidLink(generator.program['URL externe']))) {
    generator.logger.log(
      LogLevel.minor,
      generator.program['Id fiche dispositif'] + ': problème de validation du lien du champ URL externe',
      `[Lien cassé](${generator.program['URL externe']})`
    )
    return true // we add the link even if he is detected faulty.
  }
  return true
}

export async function validateObjectiveLink(link: string, step: number, generator: CoreGenerator) {
  if (!(await LinkValidator.isValidLink(link))) {
    generator.logger.log(
      LogLevel.major,
      generator.program['Id fiche dispositif'] + ": problème de validation d'un lien du champ étape " + step,
      `[Lien cassé](${link})`
    )
  }
}
