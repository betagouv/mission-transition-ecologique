import { EtablissementRepository } from './spi'
import { fetchEtablissement } from './api'
import { Result } from 'true-myth'
import { SiretNotValidError } from './types'

/**
 * Injects infrastructure dependency into domain features
 */
export const createFeatures = (etablissementRepository: EtablissementRepository) => {
  /**
   * fetchEtablissement passes through the Promise of the infrastructure
   * (promise of Etablissement in case of success, Error otherwise)
   */
  const fetchEtablissement: fetchEtablissement = async (siret) => {
    const isValidSiretFormat = /^\d{14}/.test(siret)

    if (!isValidSiretFormat) {
      return Result.err(new SiretNotValidError("Le siret n'est pas constitué de 14 chiffres"))
    }

    return etablissementRepository.getEtablissementBySiret(siret)
  }
  return { fetchEtablissement }
}
