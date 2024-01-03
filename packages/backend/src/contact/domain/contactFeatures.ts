import type { ContactInfoRepository } from './spi'

/** allows dependency injection */
export const createService = (repo: ContactInfoRepository) => {
  /**
   * postNewContact passes through the Promise of the infrastructure layer
   * (promise of ContactId in case of success, Error otherwise)
   */
  const postNewOpportunity = async (email: string, attributes: object) => {
    return repo.addContact(email, attributes)
  }

  return { postNewOpportunity: postNewOpportunity }
}
