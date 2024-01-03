import type { EtablissementRepository } from './spi'

/** allows dependency injection */
export const createService = (repo: EtablissementRepository) => {
  /*
   * fetchEtablissement passes through the Promise of the infrastructure layer
   * (promise of Etablissement in case of success, Error otherwise)
   * @param siret: a SIRET. Its format is expected to be 14 digits.
   */
  const fetchEtablissement = async (siret: string) => {
    return repo.get(siret)
  }

  return { fetchEtablissement }
}
