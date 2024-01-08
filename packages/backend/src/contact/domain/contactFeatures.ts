import { Result } from 'true-myth'
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

    const opportunityResult = await repo.addOpportunity(contactIdResult.value.id, attributes)
    if (opportunityResult.isErr) {
      return Result.err(opportunityResult.error)
    }

    return Result.ok(opportunityResult.value)
  }

  return { postNewOpportunity: postNewOpportunity }
}
