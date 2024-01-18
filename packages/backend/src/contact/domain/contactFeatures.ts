import { Maybe, Result } from 'true-myth'
import type { ContactRepository, OpportunityRepository } from './spi'
import type { OpportunityId, Opportunity } from './types'
import ProgramService from '../../program/application/programService'
import OperatorService from '../../operator/application/operatorService'

export default class ContactFeatures {
  private readonly _contactRepository: ContactRepository
  private readonly _opportunityRepository: OpportunityRepository

  constructor(contactRepository: ContactRepository, opportunityRepository: OpportunityRepository) {
    this._contactRepository = contactRepository
    this._opportunityRepository = opportunityRepository
  }

  createOpportunity = async (opportunity: Opportunity, optIn: true): Promise<Result<OpportunityId, Error>> => {
    const contactIdResult = await this._contactRepository.createOrUpdate(opportunity, optIn)
    if (contactIdResult.isErr) {
      return Result.err(contactIdResult.error)
    }

    const opportunityResult = await this._opportunityRepository.create(contactIdResult.value.id, opportunity)

    if (!opportunityResult.isErr) {
      this._createOpportunityOnOperator(opportunityResult.value, opportunity)
    }

    return opportunityResult
  }

  private _createOpportunityOnOperator(opportunityId: OpportunityId, opportunity: Opportunity) {
    const program = new ProgramService().getById(opportunity.programId)

    if (program) {
      void new OperatorService().createOpportunity(opportunity, program).then(async (operatorResult) => {
        if (false !== operatorResult) {
          const opportunityUpdateErr = await this._updateOpportunitySentToBpifrance(opportunityId, operatorResult.isOk)
          if (opportunityUpdateErr.isJust) {
            // TODO: Send an email to the admin: Opportunity not updated
          }
        }
      })
    }
  }

  private async _updateOpportunitySentToBpifrance(opportunityId: OpportunityId, success: boolean): Promise<Maybe<Error>> {
    return await this._opportunityRepository.update(opportunityId, { sentToBpifrance: success })
  }
}
