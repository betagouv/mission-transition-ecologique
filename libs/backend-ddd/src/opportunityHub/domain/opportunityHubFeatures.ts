import { OpportunityHubRepository } from './spi'
import { OpportunityWithContactId } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'
import { ProgramType, Project } from '@tee/data'
import { PlaceDesEntreprises } from '../infrastructure/api/placedesentreprises/placeDesEntreprises'
export default class OpportunityHubFeatures {
  private readonly _opportunityHubRepositories: OpportunityHubRepository[]
  constructor(opportunityHubRepositories: OpportunityHubRepository[]) {
    this._opportunityHubRepositories = opportunityHubRepositories
  }

  public async maybeTransmitOpportunity(opportunity: OpportunityWithContactId, program: ProgramType): Promise<Maybe<Error> | false> {
    for (const opportunityHubRepository of this._opportunityHubRepositories) {
      if (await opportunityHubRepository.shouldTransmit(opportunity, program)) {
        return await opportunityHubRepository.transmitProgramOpportunity(opportunity, program)
      }
    }

    return false
  }

  public async maybeTransmitProjectOpportunity(opportunity: OpportunityWithContactId, project: Project): Promise<Maybe<Error> | false> {
    for (const opportunityHubRepository of this._opportunityHubRepositories) {
      if (opportunityHubRepository instanceof PlaceDesEntreprises) {
        if (!(await opportunityHubRepository.reachedDailyContactTransmissionLimit(opportunity.contactId))) {
          return await opportunityHubRepository.transmitProjectOpportunity(opportunity, project)
        }
      }
    }

    return false
  }
}
