import { Program } from '../../program/domain/types/types'
import { OpportunityHubRepository } from './spi'
import { Opportunity } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'

export default class OpportunityHubFeatures {
  private readonly _opportunityHubRepositories: OpportunityHubRepository[]
  constructor(opportunityHubRepositories: OpportunityHubRepository[]) {
    this._opportunityHubRepositories = opportunityHubRepositories
  }

  public async createOpportunity(opportunity: Opportunity, program: Program): Promise<Maybe<Error> | false> {
    for (const opportunityHubRepository of this._opportunityHubRepositories) {
      if (opportunityHubRepository.support(program)) {
        return await opportunityHubRepository.createOpportunity(opportunity, program)
      }
    }

    return false
  }
}
