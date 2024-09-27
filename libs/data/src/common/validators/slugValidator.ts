import { Logger } from '../logger/logger'
import { LogLevel } from '../logger/types'

export class SlugValidator {
  private static slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  public static validate(slug: string, logger?: Logger): boolean {
    if (!SlugValidator.slugRegex.test(slug)) {
      if (logger) logger.log(LogLevel.critic, 'Slug Invalide, objet non généré', { slug })
      console.warn('Slug Invalide:', slug)
      return false
    }
    return true
  }
}
