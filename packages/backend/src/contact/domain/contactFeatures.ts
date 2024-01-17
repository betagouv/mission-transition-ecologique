import { Result } from 'true-myth'
import type { ContactRepository, OpportunityRepository } from './spi'
import type { OpportunityId, Opportunity } from './types'

export default class Contact {
  private readonly _contactRepository: ContactRepository
  private readonly _opportunityRepository: OpportunityRepository

  constructor(contactRepository: ContactRepository, opportunityRepository: OpportunityRepository) {
    this._contactRepository = contactRepository
    this._opportunityRepository = opportunityRepository
  }
  /**
   * postNewOpportunity creates a new opportunity, and creates or updates contact information associated with this opportunity
   *
   * It is required that the user has opt-in to allow data collection.
   *
   */
  postNewOpportunity = async (opportunity: Opportunity, optIn: true): Promise<Result<OpportunityId, Error>> => {
    const contactIdResult = await this._contactRepository.createOrUpdate(opportunity, optIn)
    if (contactIdResult.isErr) {
      return Result.err(contactIdResult.error)
    }

    const opportunityResult = await this._opportunityRepository.create(contactIdResult.value.id, opportunity)
    if (opportunityResult.isErr) {
      return Result.err(opportunityResult.error)
    }

    return Result.ok(opportunityResult.value)
  }
}
