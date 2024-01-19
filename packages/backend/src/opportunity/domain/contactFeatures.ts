import { Maybe, Result } from 'true-myth'
import type { ContactRepository, OpportunityRepository } from './spi'
import type { OpportunityId, Opportunity } from './types'
import OperatorFeatures from '../../operator/domain/operator'
import { OperatorRepository } from '../../operator/domain/spi'
import { ProgramRepository } from '../../program/domain/spi'
import ProgramFeatures from '../../program/domain/programFeatures'

export default class ContactFeatures {
  private readonly _contactRepository: ContactRepository
  private readonly _opportunityRepository: OpportunityRepository
  private readonly _operatorRepositories: OperatorRepository[]
  private readonly _programRepository: ProgramRepository

  constructor(
    contactRepository: ContactRepository,
    opportunityRepository: OpportunityRepository,
    operatorRepositories: OperatorRepository[],
    programRepository: ProgramRepository
  ) {
    this._contactRepository = contactRepository
    this._opportunityRepository = opportunityRepository
    this._operatorRepositories = operatorRepositories
    this._programRepository = programRepository
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
    const program = new ProgramFeatures(this._programRepository).getById(opportunity.programId)

    if (program) {
      void new OperatorFeatures(this._operatorRepositories).createOpportunity(opportunity, program).then(async (operatorResult) => {
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
