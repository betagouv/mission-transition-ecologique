import { Result } from 'true-myth'
import type { ContactInfoRepository } from './spi'
import { ContactBodyAttributes } from './types'

import type { DealId, Opportunity } from './types'

/** allows dependency injection */
export const createService = (contactRepository: ContactRepository, opportunityRepository: OpportunityRepository) => {
  /**
   * postNewOpportunity creates a new opportunity, and creates or updates contact information associated with this opportunity
   *
   * It is required that the user has opt-in to allow data collection.
   *
   */
  const postNewOpportunity = async (opportunity: Opportunity, optIn: true): Promise<Result<DealId, Error>> => {
    const contactIdResult = await contactRepository.create(opportunity, optIn)
    if (contactIdResult.isErr) {
      return Result.err(contactIdResult.error)
    }

    const opportunityResult = await opportunityRepository.create(contactIdResult.value.id, opportunity)
    if (opportunityResult.isErr) {
      return Result.err(opportunityResult.error)
    }

    return Result.ok(opportunityResult.value)
  }

  return { postNewOpportunity: postNewOpportunity }
}
