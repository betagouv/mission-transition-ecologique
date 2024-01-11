import type { ContactInfoRepository } from './spi'
import { ContactInfoBodyAttributes } from './types'

/** allows dependency injection */
export const createService = (repository: ContactInfoRepository) => {
  /**
   * postNewContact passes through the Promise of the infrastructure layer
   * (promise of ContactId in case of success, Error otherwise)
   */
  const postNewContact = async (email: string, attributes: ContactInfoBodyAttributes) => {
    return repository.create(email, attributes)
  }

  return { postNewContact }
}
