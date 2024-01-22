import type { EstablishmentRepository } from './spi'

/** allows dependency injection */
export const createService = (repo: EstablishmentRepository) => {
  /*
   * fetchEstablishment passes through the Promise of the infrastructure layer
   * (promise of Establishment in case of success, Error otherwise)
   * @param siret: a SIRET. Its format is expected to be 14 digits.
   */
  const fetchEstablishment = async (siret: string) => {
    return repo.get(siret)
  }

  return { fetchEstablishment }
}
