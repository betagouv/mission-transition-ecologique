import type { ContactInfoRepository } from './spi'
import Maybe, { nothing } from 'true-myth/maybe'

/** allows dependency injection */
export const createService = (repo: ContactInfoRepository) => {
  /**
   * postNewOpportunity passes through the Promise of the infrastructure layer
   * (promise of ContactId in case of success, Error otherwise)
   */
  const postNewOpportunity = async (email: string, attributes: object): Promise<Maybe<Error>> => {
    const contactId = await repo.addContact(email, attributes)
    if (contactId.isErr) {
      return Maybe.of(contactId.error)
    }
    repo.addOpportunity(contactId.value.id, attributes)
    return nothing<Error>()
  }

  return { postNewOpportunity: postNewOpportunity }
}
