import { OpportunityHubRepository } from './spi'
import { OpportunityWithContactId } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'
import { ProgramType, Project } from '@tee/data'
import { PlaceDesEntreprises } from '../infrastructure/api/placedesentreprises/placeDesEntreprises'
import { OpportunityType } from '@tee/common'

export default class OpportunityHubFeatures {
  private readonly _opportunityHubRepositories: OpportunityHubRepository[]
  constructor(opportunityHubRepositories: OpportunityHubRepository[]) {
    this._opportunityHubRepositories = opportunityHubRepositories
  }

  public async maybeTransmitOpportunity(
    opportunity: OpportunityWithContactId,
    programOrProject?: ProgramType | Project
  ): Promise<Maybe<Error> | false> {
    switch (opportunity.type) {
      case OpportunityType.Program:
        for (const opportunityHubRepository of this._opportunityHubRepositories) {
          if (await opportunityHubRepository.shouldTransmit(opportunity, programOrProject as ProgramType)) {
            return await opportunityHubRepository.transmitOpportunity(opportunity, programOrProject)
          }
        }
        return false
      case OpportunityType.Project:
        for (const opportunityHubRepository of this._opportunityHubRepositories) {
          if (opportunityHubRepository instanceof PlaceDesEntreprises) {
            if (!(await opportunityHubRepository.reachedDailyContactTransmissionLimit(opportunity.contactId))) {
              return await opportunityHubRepository.transmitOpportunity(opportunity, programOrProject as Project)
            }
          }
        }

        return false
      default:
        break
    }
  }

  public async maybeTransmitProjectOpportunity(opportunity: OpportunityWithContactId, project: Project): Promise<Maybe<Error> | false> {
    for (const opportunityHubRepository of this._opportunityHubRepositories) {
      if (opportunityHubRepository instanceof PlaceDesEntreprises) {
        if (!(await opportunityHubRepository.reachedDailyContactTransmissionLimit(opportunity.contactId))) {
          return await opportunityHubRepository.transmitOpportunity(opportunity, project)
        }
      }
    }

    return false
  }
}
