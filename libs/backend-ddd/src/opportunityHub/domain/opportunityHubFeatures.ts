import { OpportunityHubRepository } from './spi'
import { OpportunityWithContactId } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'
import { ProgramType } from '@tee/data'

export default class OpportunityHubFeatures {
  private readonly _opportunityHubRepositories: OpportunityHubRepository[]
  constructor(opportunityHubRepositories: OpportunityHubRepository[]) {
    this._opportunityHubRepositories = opportunityHubRepositories
  }

  public async maybeTransmitOpportunity(opportunity: OpportunityWithContactId, program: ProgramType): Promise<Maybe<Error> | false> {
    for (const opportunityHubRepository of this._opportunityHubRepositories) {
      if (await opportunityHubRepository.shouldTransmit(opportunity, program)) {
        return await opportunityHubRepository.transmitOpportunity(opportunity, program)
      }
    }

    return false
  }
}
