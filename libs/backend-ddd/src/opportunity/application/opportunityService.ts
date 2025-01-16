import { addBrevoContactTest } from '../../../tests/opportunity/infrastructure/api/brevo/mock/brevoContact'
import { brevoRepositoryTest } from '../../../tests/opportunity/infrastructure/api/brevo/mock/brevoDeal'
import BrevoMailTest from '../../../tests/opportunity/infrastructure/api/brevo/mock/brevoMail'
import { PlaceDesEntreprisesTest } from '../../../tests/opportunityHub/infrastructure/api/mock/placeDesEntreprises'
import Config from '../../config'
import { OpportunityDetailsShort, OpportunityId } from '../domain/types'
import OpportunityFeatures from '../domain/opportunityFeatures'
import { Result } from 'true-myth'
import { brevoRepository } from '../infrastructure/api/brevo/brevoDeal'
import { addBrevoContact } from '../infrastructure/api/brevo/brevoContact'
import { OpportunityHubRepository } from '../../opportunityHub/domain/spi'
import { ContactRepository, MailerManager, OpportunityRepository } from '../domain/spi'
import { ProgramRepository } from '../../program/domain/spi'
import ProgramsJson from '../../program/infrastructure/programsJson'
import BrevoMail from '../infrastructure/api/brevo/brevoMail'
import { PlaceDesEntreprises } from '../../opportunityHub/infrastructure/api/placedesentreprises/placeDesEntreprises'

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
    return [Config.PDE_API_ENABLED ? new PlaceDesEntreprises() : new PlaceDesEntreprisesTest()]
  }

  private _getProgramRepository(): ProgramRepository {
    return ProgramsJson.getInstance()
  }

  private _getMailRepository(): MailerManager {
    return { sendReturnReceipt: Config.BREVO_API_ENABLED ? new BrevoMail().sendReturnReceipt : new BrevoMailTest().sendReturnReceipt }
  }
}
