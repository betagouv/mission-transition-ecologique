import { EtablissementRepository } from './spi.js'
import { fetchEtablissement } from './api.js'

/**
 * Injects infrastructure dependency into domain features
 */
export const createFeatures = (etablissementRepository: EtablissementRepository) => {
  /**
   * fetchEtablissement passes through the Promise of the infrastructure
   * (promise of Etablissement in case of success, Error otherwise)
   */
  const fetchEtablissement: fetchEtablissement = async (siret) => {
    return etablissementRepository.getEtablissementBySiret(siret)
  }
  return { fetchEtablissement }
}
