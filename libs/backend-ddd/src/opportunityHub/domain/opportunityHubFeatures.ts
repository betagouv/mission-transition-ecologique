import { OpportunityHubRepository } from './spi'
import { OpportunityWithContactId } from '../../opportunity/domain/types'
import { Result } from 'true-myth'
import { PlaceDesEntreprises } from '../infrastructure/api/placedesentreprises/placeDesEntreprises'
import { OpportunityType } from '@tee/common'
import { OpportunityAssociatedData } from '../../opportunity/domain/opportunityAssociatedData'

export default class OpportunityHubFeatures {
  private readonly _opportunityHubRepositories: OpportunityHubRepository[]
  constructor(opportunityHubRepositories: OpportunityHubRepository[]) {
    this._opportunityHubRepositories = opportunityHubRepositories
  }

  public async maybeTransmitOpportunity(
    opportunity: OpportunityWithContactId,
    opportunityObject: OpportunityAssociatedData
  ): Promise<Result<number, Error> | false> {
    switch (opportunity.type) {
      case OpportunityType.Program:
        for (const opportunityHubRepository of this._opportunityHubRepositories) {
          if (await opportunityHubRepository.shouldTransmit(opportunity, opportunityObject)) {
            return await opportunityHubRepository.transmitOpportunity(opportunity, opportunityObject)
          }
        }
        return false
      case OpportunityType.Project:
      case OpportunityType.CustomProject:
        for (const opportunityHubRepository of this._opportunityHubRepositories) {
          if (opportunityHubRepository instanceof PlaceDesEntreprises) {
            if (!(await opportunityHubRepository.reachedDailyContactTransmissionLimit(opportunity.contactId))) {
              return await opportunityHubRepository.transmitOpportunity(opportunity, opportunityObject)
            }
          }
        }
        return false
      default:
        return false
    }
  }

  public async shouldTransmitToPDE(opportunity: OpportunityWithContactId, opportunityObject: OpportunityAssociatedData): Promise<boolean> {
    for (const opportunityHubRepository of this._opportunityHubRepositories) {
      if (opportunityHubRepository instanceof PlaceDesEntreprises) {
        return await opportunityHubRepository.shouldTransmit(opportunity, opportunityObject)
      }
    }

    return false
  }
}
