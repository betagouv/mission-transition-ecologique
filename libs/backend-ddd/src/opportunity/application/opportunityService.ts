import Config from '../../config'
import { OpportunityDetailsShort, OpportunityId } from '../domain/types'
import OpportunityFeatures from '../domain/opportunityFeatures'
import { Result } from 'true-myth'

import { brevoRepository } from '../infrastructure/api/brevo/brevoDeal'
import { brevoRepositoryTest } from '../infrastructure/api/brevo/mock/brevoDeal'

import { addBrevoContact } from '../infrastructure/api/brevo/brevoContact'
import { addBrevoContactTest } from '../infrastructure/api/brevo/mock/brevoContact'

import { OpportunityHubRepository } from '../../opportunityHub/domain/spi'

import { BpiFrance } from '../../opportunityHub/infrastructure/api/bpi/bpiFrance'
import { BpiFranceTest } from '../../opportunityHub/infrastructure/api/mock/bpiFrance'

import { ContactRepository, MailerManager, OpportunityRepository } from '../domain/spi'
import { ProgramRepository } from '../../program/domain/spi'
import ProgramsJson from '../../program/infrastructure/programsJson'

import BrevoMail from '../infrastructure/api/brevo/brevoMail'
import BrevoMailTest from '../infrastructure/api/brevo/mock/brevoMail'

import { PlaceDesEntreprises } from '../../opportunityHub/infrastructure/api/placedesentreprises/placeDesEntreprises'
import { PlaceDesEntreprisesTest } from '../../opportunityHub/infrastructure/api/mock/placeDesEntreprises'

import { Opportunity } from '@tee/common'

export default class OpportunityService {
  private _opportunityFeatures: OpportunityFeatures

  constructor() {
    this._opportunityFeatures = new OpportunityFeatures(
      this._getContactRepository(),
      this._getOpportunityRepository(),
      this._getOpportunityHubRepositories(),
      this._getProgramRepository(),
      this._getMailRepository()
    )
  }

  public async createOpportunity(opportunity: Opportunity, optIn: boolean): Promise<Result<OpportunityId, Error>> {
    if (!optIn) {
      return Result.err(new Error('opt-in is required for storing contact data'))
    }
    return await this._opportunityFeatures.createOpportunity(opportunity, optIn)
  }

  public async getDailyOpportunitiesByContactId(contactId: number): Promise<Result<OpportunityDetailsShort[], Error>> {
    return await this._opportunityFeatures.getDailyOpportunitiesByContactId(contactId)
  }

  private _getContactRepository(): ContactRepository {
    return {
      createOrUpdate: Config.BREVO_API_ENABLED ? addBrevoContact : addBrevoContactTest
    }
  }

  private _getOpportunityRepository(): OpportunityRepository {
    return Config.BREVO_API_ENABLED ? brevoRepository : brevoRepositoryTest
  }

  private _getOpportunityHubRepositories(): OpportunityHubRepository[] {
    return [
      Config.PDE_API_ENABLED ? new PlaceDesEntreprises() : new PlaceDesEntreprisesTest(),
      Config.BPI_API_ENABLED ? new BpiFrance() : new BpiFranceTest()
    ]
  }

  private _getProgramRepository(): ProgramRepository {
    return ProgramsJson.getInstance()
  }

  private _getMailRepository(): MailerManager {
    return { sendReturnReceipt: Config.BREVO_API_ENABLED ? new BrevoMail().sendReturnReceipt : new BrevoMailTest().sendReturnReceipt }
  }
}
