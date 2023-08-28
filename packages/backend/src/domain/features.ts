import { EtablissementRepository } from './spi'
import { fetchEtablissement } from './api'

/**
 * Injects infrastructure dependency into domain features
 */
export const createFeatures = (etablissementRepository: EtablissementRepository) => {
  /**
   * fetchEtablissement passes through the Promise of the infrastructure
   * (promise of Etablissement in case of success, Error otherwise)
   * @param siret: a SIRET. Its format is expected to be 14 digits.
   */
  const fetchEtablissement: fetchEtablissement = async (siret) => {
    return etablissementRepository.getEtablissementBySiret(siret)
  }
  return { fetchEtablissement }
}
