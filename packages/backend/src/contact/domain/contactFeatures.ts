import { Result } from 'true-myth'
import type { ContactInfoRepository } from './spi'

/** allows dependency injection */
export const createService = (repo: ContactInfoRepository) => {
  /**
   * postNewOpportunity passes through the Promise of the infrastructure layer
   * (promise of ContactId in case of success, Error otherwise)
   */
  const postNewOpportunity = async (email: string, attributes: object): Promise<Result<void, Error>> => {
    const contactId = await repo.addContact(email, attributes)
    if (contactId.isErr) {
      return Result.err(contactId.error)
    }
    repo.addOpportunity(contactId.value.id, attributes)
    return Result.ok(void)
  }

  return { postNewOpportunity: postNewOpportunity }
}
