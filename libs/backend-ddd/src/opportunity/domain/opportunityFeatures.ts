import { Maybe, Result } from 'true-myth'
import type { ContactRepository, MailerManager, OpportunityRepository } from './spi'
import { OpportunityId, OpportunityWithContactId, OpportunityDetailsShort, OpportunityWithOperatorContact } from './types'
import OpportunityHubFeatures from '../../opportunityHub/domain/opportunityHubFeatures'
import { OpportunityHubRepository } from '../../opportunityHub/domain/spi'
import { ProgramRepository } from '../../program/domain/spi'
import ProgramFeatures from '../../program/domain/programFeatures'
import { ProgramType } from '@tee/data'
import { ContactDetails, Opportunity, SiretValidator } from '@tee/common'
import EstablishmentService from '../../establishment/application/establishmentService'

export default class OpportunityFeatures {
  private readonly _contactRepository: ContactRepository
  private readonly _opportunityRepository: OpportunityRepository
  private readonly _opportunityHubRepositories: OpportunityHubRepository[]
  private readonly _programRepository: ProgramRepository
  private readonly _mailRepository: MailerManager

  constructor(
    contactRepository: ContactRepository,
    opportunityRepository: OpportunityRepository,
    opportunityHubRepositories: OpportunityHubRepository[],
    programRepository: ProgramRepository,
    mailRepository: MailerManager
  ) {
    this._contactRepository = contactRepository
    this._opportunityRepository = opportunityRepository
    this._opportunityHubRepositories = opportunityHubRepositories
    this._programRepository = programRepository
    this._mailRepository = mailRepository
  }

  createOpportunity = async (opportunity: Opportunity, optIn: true): Promise<Result<OpportunityId, Error>> => {
    const maybeFullopportunity = await this._verifyAndAddEstablishmentData(opportunity)
    if (maybeFullopportunity.isErr) {
      return Result.err(maybeFullopportunity.error)
    }
    opportunity = maybeFullopportunity.value
    const contactIdResult = await this._contactRepository.createOrUpdate(opportunity as ContactDetails, optIn)
    if (contactIdResult.isErr) {
      // TODO : Send notif: contact and opportunity not created!
      return Result.err(contactIdResult.error)
    }

    const program = this._getProgramById(opportunity.programId)

    const opportunityResult = await this._opportunityRepository.create(
      contactIdResult.value.id,
      this._addContactOperatorToOpportunity(opportunity, program)
    )
    if (opportunityResult.isErr || program === undefined) {
      // TODO : Send notif: opportunity not created or opportunity created on an unknown program
      return opportunityResult
    }

    this._sendReturnReceipt(opportunity, program)
    this._transmitOpportunityToHubs(
      opportunityResult.value,
      this._addContactIdToOpportunity(opportunity, contactIdResult.value.id),
      program
    )

    return opportunityResult
  }

  getDailyOpportunitiesByContactId = async (contactId: number): Promise<Result<OpportunityDetailsShort[], Error>> => {
    return await this._opportunityRepository.getDailyOpportunitiesByContactId(contactId)
  }

  private _transmitOpportunityToHubs(opportunityId: OpportunityId, opportunity: OpportunityWithContactId, program: ProgramType) {
    void new OpportunityHubFeatures(this._opportunityHubRepositories)
      .maybeTransmitOpportunity(opportunity, program)
      .then(async (opportunityHubResult) => {
        if (opportunityHubResult !== false) {
          const opportunityUpdateErr = await this._updateOpportunitySentToHub(opportunityId, !opportunityHubResult.isJust)
          if (opportunityUpdateErr.isJust) {
            // TODO: Send notif: Opportunity not updated in our DB creating a missmatch between the status in the DB and the real opportunity status
          }
        }
      })
  }

  private async _updateOpportunitySentToHub(opportunityId: OpportunityId, success: boolean): Promise<Maybe<Error>> {
    return await this._opportunityRepository.update(opportunityId, { sentToOpportunityHub: success })
  }

  private _addContactOperatorToOpportunity(opportunity: Opportunity, program: ProgramType | undefined): OpportunityWithOperatorContact {
    return {
      ...opportunity,
      programContactOperator: program?.['opérateur de contact']
    }
  }

  private _addContactIdToOpportunity(opportunity: Opportunity, id: number): OpportunityWithContactId {
    return {
      ...opportunity,
      contactId: id
    }
  }

  private _getProgramById(id: string): ProgramType | undefined {
    return new ProgramFeatures(this._programRepository).getById(id)
  }

  private _sendReturnReceipt(opportunity: Opportunity, program: ProgramType) {
    void this._mailRepository.sendReturnReceipt(opportunity, program).then((hasError) => {
      if (hasError) {
        // TODO: Send an email to the admin: Receipt not sent or add error on sentry
      }
    })
  }

  private async _verifyAndAddEstablishmentData(opportunity: Opportunity): Promise<Result<Opportunity, Error>> {
    if (!SiretValidator.validate(opportunity.companySiret)) {
      return Result.err(new Error('invalid SIRET')) //since there is a validator in the front end,
      // it means this is a direct query which we can ignore if poorly formatted
    }
    const establishmentInfos = await new EstablishmentService().getBySiret(opportunity.companySiret)
    if (establishmentInfos.isErr) {
      return Result.ok(opportunity) // if we don't suceed in enhancing the data, we still want to create an opportunity
    }
    opportunity.companyName = establishmentInfos.value.denomination
    opportunity.companySector = establishmentInfos.value.nafLabel || ''

    const dictionaries = JSON.parse(opportunity.otherData || '[]') as Dictionary[]
    const newDictionary = {} as Dictionary
    if (!this._updateValueInDictionaries(dictionaries, 'codeNAF', establishmentInfos.value.nafCode)) {
      newDictionary['codeNAF'] = establishmentInfos.value.nafCode
    }
    if (!this._updateValueInDictionaries(dictionaries, 'codePostal', establishmentInfos.value.address.zipCode)) {
      newDictionary['codePostal'] = establishmentInfos.value.address.zipCode
    }
    if (!this._updateValueInDictionaries(dictionaries, 'region', establishmentInfos.value.region || '')) {
      newDictionary['region'] = establishmentInfos.value.region || ''
    }
    if (Object.values(newDictionary).length > 0) {
      dictionaries.push(newDictionary)
    }
    opportunity.otherData = JSON.stringify(dictionaries)

    return Result.ok(opportunity)
  }

  private _updateValueInDictionaries(dictionaries: Dictionary[], key: string, val: string): boolean {
    for (const dictionary of dictionaries) {
      if (key in dictionary) {
        dictionary[key] = val
        return true
      }
    }
    return false
  }
}

type Dictionary = Record<string, unknown>
