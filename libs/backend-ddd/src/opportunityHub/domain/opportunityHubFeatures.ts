import { OpportunityHubRepository } from './spi'
import { OpportunityObjectDetails, OpportunityWithContactId } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'
import { PlaceDesEntreprises } from '../infrastructure/api/placedesentreprises/placeDesEntreprises'
import { OpportunityType } from '@tee/common'

export default class OpportunityHubFeatures {
  private readonly _opportunityHubRepositories: OpportunityHubRepository[]
  constructor(opportunityHubRepositories: OpportunityHubRepository[]) {
    this._opportunityHubRepositories = opportunityHubRepositories
  }

  public async maybeTransmitOpportunity(
    opportunity: OpportunityWithContactId,
    programOrProject: OpportunityObjectDetails
  ): Promise<Maybe<Error> | false> {
    switch (opportunity.type) {
      case OpportunityType.Program:
        for (const opportunityHubRepository of this._opportunityHubRepositories) {
          if (await opportunityHubRepository.shouldTransmit(opportunity, programOrProject)) {
            return await opportunityHubRepository.transmitOpportunity(opportunity, programOrProject)
          }
        }
        return false
      case OpportunityType.Project:
      case OpportunityType.CustomProject:
        for (const opportunityHubRepository of this._opportunityHubRepositories) {
          if (opportunityHubRepository instanceof PlaceDesEntreprises) {
            if (!(await opportunityHubRepository.reachedDailyContactTransmissionLimit(opportunity.contactId))) {
              return await opportunityHubRepository.transmitOpportunity(opportunity, programOrProject)
            }
          }
        }

        return false
      default:
        break
    }
  }
}
