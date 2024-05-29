import { Maybe, Result } from 'true-myth'
import type { ContactRepository, MailerService, OpportunityRepository } from './spi'
import type { OpportunityId, Opportunity, ContactDetails } from './types'
import OpportunityHubFeatures from '../../opportunityHub/domain/opportunityHubFeatures'
import { OpportunityHubRepository } from '../../opportunityHub/domain/spi'
import { ProgramRepository } from '../../program/domain/spi'
import ProgramFeatures from '../../program/domain/programFeatures'
import { Program } from '@tee/data/src/type/program'

export default class OpportunityFeatures {
  private readonly _contactRepository: ContactRepository
  private readonly _opportunityRepository: OpportunityRepository
  private readonly _opportunityHubRepositories: OpportunityHubRepository[]
  private readonly _programRepository: ProgramRepository
  private readonly _mailRepository: MailerService

  constructor(
    contactRepository: ContactRepository,
    opportunityRepository: OpportunityRepository,
    opportunityHubRepositories: OpportunityHubRepository[],
    programRepository: ProgramRepository,
    mailRepository: MailerService
  ) {
    this._contactRepository = contactRepository
    this._opportunityRepository = opportunityRepository
    this._opportunityHubRepositories = opportunityHubRepositories
    this._programRepository = programRepository
    this._mailRepository = mailRepository
  }

  createOpportunity = async (opportunity: Opportunity, optIn: true): Promise<Result<OpportunityId, Error>> => {
    const contactIdResult = await this._contactRepository.createOrUpdate(opportunity as ContactDetails, optIn)
    if (contactIdResult.isErr) {
      // TODO : Send an email to the admin: contact and opportunity not created!
      return Result.err(contactIdResult.error)
    }

    const program = this._getProgramById(opportunity.programId)
    opportunity = this._addContactOperatorToOpportunity(opportunity, program)

    const opportunityResult = await this._opportunityRepository.create(contactIdResult.value.id, opportunity)
    if (opportunityResult.isErr || program == undefined) {
      // TODO : Send an email to the admin: opportunity not created or opportunity created on an unknown program
      return opportunityResult
    }

    opportunity = this._addContactIdToOpportunity(opportunity, contactIdResult.value.id)
    this._sendReturnReceipt(opportunity, program)
    this._maybeTransmitOpportunityToHubs(opportunityResult.value, opportunity, program)
    return opportunityResult
  }

  getdailyOpportunitiesByContactId = async (contactId: number): Promise<Result<Opportunity[], Error>> => {
    return await this._opportunityRepository.getdailyOpportunitiesByContactId(contactId)
  }

  private _maybeTransmitOpportunityToHubs(opportunityId: OpportunityId, opportunity: Opportunity, program: Program) {
    void new OpportunityHubFeatures(this._opportunityHubRepositories)
      .maybeTransmitOpportunity(opportunity, program)
      .then(async (opportunityHubResult) => {
        if (opportunityHubResult !== false) {
          const opportunityUpdateErr = await this._updateOpportunitySentToHub(opportunityId, !opportunityHubResult.isJust)
          if (opportunityUpdateErr.isJust) {
            // TODO: Send an email to the admin: Opportunity not updated creating a missmatch between the status in the DB and the real opportunity status
          }
        }
      })
  }

  private async _updateOpportunitySentToHub(opportunityId: OpportunityId, success: boolean): Promise<Maybe<Error>> {
    return await this._opportunityRepository.update(opportunityId, { sentToOpportunityHub: success })
  }

  private _addContactOperatorToOpportunity(opportunity: Opportunity, program: Program | undefined): Opportunity {
    if (program) {
      opportunity.programContactOperator = program['opérateur de contact']
    }
    return opportunity
  }
  private _addContactIdToOpportunity(opportunity: Opportunity, id: number): Opportunity {
    opportunity.contactId = id
    return opportunity
  }

  private _getProgramById(id: string): Program | undefined {
    return new ProgramFeatures(this._programRepository).getById(id)
  }

  private _sendReturnReceipt(opportunity: Opportunity, program: Program) {
    void this._mailRepository.sendReturnReceipt(opportunity, program).then((hasError) => {
      if (hasError) {
        // TODO: Send an email to the admin: Receipt not sent or add error on sentry
      }
    })
  }
}
