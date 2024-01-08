import Result from 'true-myth/result'
import type { ContactInfoRepository } from './spi'

import type { DealId } from './types'

/** allows dependency injection */
export const createService = (repo: ContactInfoRepository) => {
  /**
   * postNewOpportunity passes through the Promise of the infrastructure layer
   * (promise of ContactId in case of success, Error otherwise)
   */
  const postNewOpportunity = async (email: string, attributes: object): Promise<Result<DealId, Error>> => {
    const contactIdResult = await repo.addContact(email, attributes)
    if (contactIdResult.isErr) {
      return Result.err(contactIdResult.error)
    }
    repo.addOpportunity(contactIdResult.value.id, attributes)
    return Result.ok({ id: 'abc' })
  }

  return { postNewOpportunity: postNewOpportunity }
}
