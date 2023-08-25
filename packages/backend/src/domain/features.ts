import { EtablissementRepository, BrevoRepository } from './spi'
import { fetchEtablissement, postContact } from './api'

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

export const createContact = (brevoRepository: BrevoRepository) => {
  /**
   * postNewContact passes through the Promise of the infrastructure
   * (promise of BrevoResult in case of success, Error otherwise)
   * @param email: an email
   * @param listIds: an array of brevo list ids
   * @param attributes: attributes
   */
  const postNewContact: postContact = async (email: string, listIds: number[], attributes: object) => {
    return brevoRepository.postNewContact(email, listIds, attributes)
  }
  return { postNewContact }
}
