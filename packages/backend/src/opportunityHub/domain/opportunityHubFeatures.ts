import { Program } from '../../program/domain/types/types'
import { OpportunityHubRepository } from './spi'
import { OpportunityWithContactId } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'

export default class OpportunityHubFeatures {
  private readonly _opportunityHubRepositories: OpportunityHubRepository[]
  constructor(opportunityHubRepositories: OpportunityHubRepository[]) {
    this._opportunityHubRepositories = opportunityHubRepositories
  }

  public async maybeTransmitOpportunity(opportunity: OpportunityWithContactId, program: Program): Promise<Maybe<Error> | false> {
    for (const opportunityHubRepository of this._opportunityHubRepositories) {
      if (await opportunityHubRepository.shouldTransmit(opportunity, program)) {
        return await opportunityHubRepository.transmitOpportunity(opportunity, program)
      }
    }

    return false
  }
}
