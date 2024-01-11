import { Result } from 'true-myth'
import type { ContactInfoRepository } from './spi'

import type { DealId, Opportunity } from './types'

/** allows dependency injection */
export const createService = (repo: ContactInfoRepository) => {
  /**
   * postNewOpportunity creates a new opportunity, and creates or updates contact information associated with this opportunity
   *
   * It is required that the user has opt-in to allow data collection.
   *
   */
  const postNewOpportunity = async (opportunity: Opportunity, optIn: true): Promise<Result<DealId, Error>> => {
    const contactIdResult = await repo.addContact(opportunity, optIn)
    if (contactIdResult.isErr) {
      return Result.err(contactIdResult.error)
    }

    const opportunityResult = await repo.addOpportunity(contactIdResult.value.id, opportunity)
    if (opportunityResult.isErr) {
      return Result.err(opportunityResult.error)
    }

    return Result.ok(opportunityResult.value)
  }

  return { postNewOpportunity: postNewOpportunity }
}
