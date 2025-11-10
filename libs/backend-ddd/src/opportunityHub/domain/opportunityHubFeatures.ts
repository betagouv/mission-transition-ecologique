import { OpportunityHubRepository } from './spi'
import { OpportunityWithContactId } from '../../opportunity/domain/types'
import { Result } from 'true-myth'
import { OpportunityAssociatedData } from '../../opportunity/domain/opportunityAssociatedData'

export default class OpportunityHubFeatures {
  private readonly _opportunityHubRepositories: OpportunityHubRepository[]
  constructor(opportunityHubRepositories: OpportunityHubRepository[]) {
    this._opportunityHubRepositories = opportunityHubRepositories
  }

  public async transmitOpportunity(
    opportunity: OpportunityWithContactId,
    opportunityData: OpportunityAssociatedData
  ): Promise<Result<number, Error> | false> {
    for (const opportunityHubRepository of this._opportunityHubRepositories) {
      if (opportunityHubRepository.support(opportunityData)) {
        return await opportunityHubRepository.transmitOpportunity(opportunity, opportunityData)
      }
    }
    return false
  }

  public needReturnReceipt(opportunityData: OpportunityAssociatedData): boolean {
    for (const opportunityHubRepository of this._opportunityHubRepositories) {
      if (opportunityHubRepository.support(opportunityData) && opportunityHubRepository.needReturnReceipt()) {
        return true
      }
    }

    return false
  }

  public hasTransmissionLimit = (opportunityData: OpportunityAssociatedData): boolean => {
    for (const opportunityHubRepository of this._opportunityHubRepositories) {
      if (opportunityHubRepository.support(opportunityData)) {
        return opportunityHubRepository.hasTransmissionLimit()
      }
    }

    return false
  }
}
