import { Maybe, Result } from 'true-myth'
import EstablishmentFeatures from '../../establishment/domain/establishmentFeatures'
import ProjectFeatures from '../../project/domain/projectFeatures'
import { OpportunityAssociatedData } from './opportunityAssociatedData'
import type { ContactRepository, MailerManager, OpportunityRepository } from './spi'
import { OpportunityId, OpportunityWithContactId, OpportunityWithOperatorContactAndContactId } from './types'
import OpportunityHubFeatures from '../../opportunityHub/domain/opportunityHubFeatures'
import ProgramFeatures from '../../program/domain/programFeatures'
import { Operators, ProgramType } from '@tee/data'
import { ContactDetails, Opportunity, OpportunityType, SiretValidator, ThemeId } from '@tee/common'
import Monitor from '../../common/domain/monitoring/monitor'

export default class OpportunityFeatures {
  constructor(
    private readonly _contactRepository: ContactRepository,
    private readonly _opportunityRepository: OpportunityRepository,
    private readonly _mailRepository: MailerManager,
    private readonly _opportunityHubFeatures: OpportunityHubFeatures,
    private readonly _programFeatures: ProgramFeatures,
    private readonly _projectFeatures: ProjectFeatures,
    private readonly _establishmentFeatures: EstablishmentFeatures
  ) {}

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

    const opportunityAssociatedData = this._createOpportunityAssociatedData(opportunityWithOperatorAndContact)
    if (opportunityAssociatedData.isErr) {
      Monitor.error('Error during the creation of the Opportunity Associated Object', { error: opportunityAssociatedData.error })
      return Result.err(opportunityAssociatedData.error)
    }

    const opportunityResult = await this._opportunityRepository.create(opportunityWithOperatorAndContact, opportunityAssociatedData.value)
    if (opportunityResult.isErr) {
      Monitor.error('Error during Opportunity Creation', { error: opportunityResult.error })
      return opportunityResult
    }

    void (async () => {
      if (!(await this._hasReachedTransmissionLimit(opportunityWithContactId, opportunityAssociatedData.value))) {
        void this._transmitOpportunityToHubs(opportunityResult.value, opportunityWithOperatorAndContact, opportunityAssociatedData.value)
      } else {
        void this._sendReturnReceipt(opportunityWithContactId, opportunityAssociatedData.value)
      }
    })()

    return opportunityResult
  }

  private _createOpportunityAssociatedData(
    opportunity: OpportunityWithOperatorContactAndContactId
  ): Result<OpportunityAssociatedData, Error> {
    switch (opportunity.type) {
      case OpportunityType.Program: {
        const associatedProgram = this._getProgramById(opportunity.id)
        if (!associatedProgram) {
          return Result.err(new Error('Program with id ' + opportunity.id + 'not found'))
        }
        return Result.ok(new OpportunityAssociatedData(OpportunityType.Program, associatedProgram))
      }
      case OpportunityType.Project: {
        const associatedProject = this._projectFeatures.getById(+opportunity.id)
        if (!associatedProject) {
          return Result.err(new Error('Project with id ' + opportunity.id + 'not found'))
        }
        return Result.ok(new OpportunityAssociatedData(OpportunityType.Project, associatedProject))
      }
      case OpportunityType.CustomProject:
        opportunity.id = opportunity.titleMessage || 'Projet sans Titre'
        return Result.ok(
          new OpportunityAssociatedData(OpportunityType.CustomProject, {
            title: opportunity.titleMessage || 'Untitled',
            theme: opportunity.theme as ThemeId
          })
        )
      default:
        return Result.err(new Error('Opportunity type not handled in _createOpportunityAssociatedData'))
    }
  }

  private async _transmitOpportunityToHubs(
    opportunityId: OpportunityId,
    opportunity: OpportunityWithContactId,
    opportunityData: OpportunityAssociatedData
  ) {
    const opportunityHubResult = await this._opportunityHubFeatures.transmitOpportunity(opportunity, opportunityData)

    if (opportunityHubResult !== false && opportunityHubResult.isOk) {
      const opportunityUpdateErr = await this._updateOpportunitySentToHub(opportunityId, opportunityHubResult.value)
      if (opportunityUpdateErr.isJust) {
        Monitor.warning('Opportunity status not updated after a transmission to a Hub', {
          error: opportunityUpdateErr.value,
          idCe: opportunityHubResult.value
        })
      }
    }
  }

  private async _updateOpportunitySentToHub(opportunityId: OpportunityId, idCe: number): Promise<Maybe<Error | null>> {
    return await this._opportunityRepository.update(opportunityId, { sentToOpportunityHub: true, idCe })
  }

  private _addContactOperatorToOpportunity(opportunity: OpportunityWithContactId): OpportunityWithOperatorContactAndContactId {
    switch (opportunity.type) {
      case OpportunityType.Program:
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

  private _addContactIdToOpportunity(opportunity: Opportunity, id: number): OpportunityWithContactId {
    return {
      ...opportunity,
      contactId: id
    }
  }

  private _getProgramById(id: string): ProgramType | undefined {
    return this._programFeatures.getOneById(id)
  }

  private async _sendReturnReceipt(opportunity: OpportunityWithContactId, opportunityData: OpportunityAssociatedData) {
    const hasError = await this._mailRepository.sendReturnReceipt(opportunity, opportunityData)
    if (hasError) {
      Monitor.warning('Error while sending a return receipt', { error: hasError })
    }
  }

  private async _hasReachedTransmissionLimit(
    opportunity: OpportunityWithContactId,
    opportunityData: OpportunityAssociatedData
  ): Promise<boolean> {
    if (!this._opportunityHubFeatures.hasTransmissionLimit(opportunityData)) {
      return false
    }

    const previousDailyOpportunities = await this._opportunityRepository.getDailyOpportunitiesByContactId(opportunity.contactId)
    if (previousDailyOpportunities.isErr) {
      return false
    }

    // The current opportunity being already created in BREVO when we check the hub transmission, we count the current program.
    // The question is do we have MORE than one transmissible opportunity, which indicates older transmissions.
    // We count all opportunities types (programs, projects, custom projects) as transmissible here.
    return previousDailyOpportunities.value.length > 1
  }

  private async _verifyAndAddEstablishmentData(opportunity: Opportunity): Promise<Result<Opportunity, Error>> {
    if (!SiretValidator.validate(opportunity.companySiret)) {
      return Result.err(new Error('invalid SIRET')) //since there is a validator in the front end,
      // it means this is a direct query which we can ignore if poorly formatted
    }
    const establishmentInfos = await this._establishmentFeatures.getBySiret(opportunity.companySiret)
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
      if (dictionary && key in dictionary) {
        dictionary[key] = val
        return true
      }
    }
    return false
  }
}

type Dictionary = Record<string, unknown>
