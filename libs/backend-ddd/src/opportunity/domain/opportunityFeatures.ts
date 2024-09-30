import { Maybe, Result } from 'true-myth'
import { ProgramOrProject } from '../../common/domain/programOrProject'
import type { ContactRepository, MailerManager, OpportunityRepository } from './spi'
import { OpportunityId, OpportunityWithContactId, OpportunityDetailsShort, OpportunityWithOperatorContactAndContactId } from './types'
import OpportunityHubFeatures from '../../opportunityHub/domain/opportunityHubFeatures'
import { OpportunityHubRepository } from '../../opportunityHub/domain/spi'
import { ProgramRepository } from '../../program/domain/spi'
import ProgramFeatures from '../../program/domain/programFeatures'
import { Operators, ProgramType } from '@tee/data'
import { ContactDetails, Opportunity, OpportunityType, SiretValidator } from '@tee/common'
import EstablishmentService from '../../establishment/application/establishmentService'
import Monitor from '../../common/domain/monitoring/monitor'
import { ProjectService } from '../../project/application/projectService'

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
    const maybeFullOpportunity = await this._verifyAndAddEstablishmentData(opportunity)
    if (maybeFullOpportunity.isErr) {
      return Result.err(maybeFullOpportunity.error)
    }
    opportunity = maybeFullOpportunity.value
    const contactIdResult = await this._contactRepository.createOrUpdate(opportunity as ContactDetails, optIn)
    if (contactIdResult.isErr) {
      Monitor.error('Error during contact creation', { error: contactIdResult.error })
      return Result.err(contactIdResult.error)
    }

    const opportunityWithContactId = this._addContactIdToOpportunity(opportunity, contactIdResult.value.id)
    const opportunityWithOperatorAndContact = this._addContactOperatorToOpportunity(opportunityWithContactId)

    const maybeError = this._defineOpportunityDatabaseId(opportunityWithOperatorAndContact)
    if (maybeError.isJust) {
      return Result.err(maybeError.value)
    }

    const programOrProject = this._getProgramOrProject(opportunityWithOperatorAndContact)

    const opportunityResult = await this._opportunityRepository.create(opportunityWithOperatorAndContact)
    if (opportunityResult.isErr) {
      Monitor.error('Error during Opportunity Creation', { error: opportunityResult.error })
      return opportunityResult
    }

    this._sendReturnReceipt(opportunity, programOrProject)
    this._transmitOpportunityToHubs(opportunityResult.value, opportunity)

    return opportunityResult
  }

  getDailyOpportunitiesByContactId = async (contactId: number): Promise<Result<OpportunityDetailsShort[], Error>> => {
    return await this._opportunityRepository.getDailyOpportunitiesByContactId(contactId)
  }

  private _getProgramOrProject(opportunity: OpportunityWithOperatorContactAndContactId): ProgramOrProject {
    switch (opportunity.type) {
      case OpportunityType.Program:
        return new ProgramOrProject(OpportunityType.Program, this._getProgramById(opportunity.id))
      case OpportunityType.Project:
        return new ProgramOrProject(OpportunityType.Project, new ProjectService().getById(+opportunity.id))
      case OpportunityType.CustomProject:
        return new ProgramOrProject(OpportunityType.CustomProject, undefined)
    }
  }

  private _transmitOpportunityToHubs(opportunityId: OpportunityId, opportunity: OpportunityWithContactId, program: ProgramType) {
    switch (opportunity.type) {
      case OpportunityType.Program:
        void new OpportunityHubFeatures(this._opportunityHubRepositories)
          .maybeTransmitOpportunity(opportunity, program)
          .then(async (opportunityHubResult) => {
            if (opportunityHubResult == Maybe.nothing()) {
              const opportunityUpdateErr = await this._updateOpportunitySentToHub(opportunityId, !opportunityHubResult.isJust)
              if (opportunityUpdateErr.isJust) {
                Monitor.warning('Opportunity status not updated after a transmission to a Hub', { error: opportunityUpdateErr.value })
              }
            }
          })

        break

      case OpportunityType.Project:
        void new OpportunityHubFeatures(this._opportunityHubRepositories)
          .maybeTransmitProjectOpportunity(opportunity, project)
          .then(async (opportunityHubResult) => {
            if (opportunityHubResult == Maybe.nothing()) {
              const opportunityUpdateErr = await this._updateOpportunitySentToHub(opportunityId, !opportunityHubResult.isJust)
              if (opportunityUpdateErr.isJust) {
                // TODO: Send notif: Opportunity not updated in our DB creating a missmatch between the status in the DB and the real opportunity status
              }
            }
          })
        break

      default:
        break
    }
  }

  private async _updateOpportunitySentToHub(opportunityId: OpportunityId, success: boolean): Promise<Maybe<Error>> {
    return await this._opportunityRepository.update(opportunityId, { sentToOpportunityHub: success })
  }

  private _addContactOperatorToOpportunity(opportunity: OpportunityWithContactId): OpportunityWithOperatorContactAndContactId {
    switch (opportunity.type) {
      case OpportunityType.Program:
        // TODO handle case progrma undefined
        //         Monitor.error('Error during Opportunity Creation, program undefined')

        return {
          ...opportunity,
          programContactOperator: this._getProgramById(opportunity.id)?.['opérateur de contact']
        }
      case OpportunityType.Project:
      case OpportunityType.CustomProject:
        return {
          ...opportunity,
          programContactOperator: 'TEE' as Operators
        }
    }
  }

  private _defineOpportunityDatabaseId(opportunity: OpportunityWithOperatorContactAndContactId): Maybe<Error> {
    if (opportunity.type === OpportunityType.Project) {
      const project = new ProjectService().getById(+opportunity.id)
      if (!project) {
        return Maybe.just(new Error('Project with id ' + opportunity.id + 'not found'))
      }
      opportunity.id = project.slug
    }
    // do nothing in all the other type for which the databaseId is already the domainId.
    return Maybe.nothing()
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

  private _sendReturnReceipt(opportunity: Opportunity, programOrProject: ProgramOrProject) {
    void this._mailRepository.sendReturnReceipt(opportunity, programOrProject).then((hasError) => {
      if (hasError) {
        Monitor.warning('Error while sending a return receipt', { error: hasError })
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
