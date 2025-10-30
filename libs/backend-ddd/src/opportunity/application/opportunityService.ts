import { addBrevoContactMock } from '../../../tests/opportunity/infrastructure/api/brevo/mock/brevoContact.mock'
import { brevoRepositoryMock } from '../../../tests/opportunity/infrastructure/api/brevo/mock/brevoDeal.mock'
import BrevoMailMock from '../../../tests/opportunity/infrastructure/api/brevo/mock/brevoMail.mock'
import { PlaceDesEntreprisesMock } from '../../../tests/opportunityHub/infrastructure/api/mock/placeDesEntreprises.mock'
import Config from '../../config'
import EstablishmentService from '../../establishment/application/establishmentService'
import OpportunityHubFeatures from '../../opportunityHub/domain/opportunityHubFeatures'
import { ProgramService } from '../../program'
import ProgramFeatures from '../../program/domain/programFeatures'
import { ProjectService } from '../../project'
import { OpportunityId } from '../domain/types'
import OpportunityFeatures from '../domain/opportunityFeatures'
import { Result } from 'true-myth'
import { brevoRepository } from '../infrastructure/api/brevo/brevoDeal'
import { addBrevoContact } from '../infrastructure/api/brevo/brevoContact'
import { ContactRepository, MailerManager, OpportunityRepository } from '../domain/spi'
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
      this._getMailRepository(),
      this._getOpportunityHubFeatures(),
      new ProgramService().program,
      new ProjectService().project,
      new EstablishmentService().establishmentFeatures
    )
  }

  public async createOpportunity(opportunity: Opportunity, optIn: boolean): Promise<Result<OpportunityId, Error>> {
    if (!optIn) {
      return Result.err(new Error('opt-in is required for storing contact data'))
    }
    return await this._opportunityFeatures.createOpportunity(opportunity, optIn)
  }

  private _getContactRepository(): ContactRepository {
    return {
      createOrUpdate: Config.BREVO_API_ENABLED ? addBrevoContact : addBrevoContactMock
    }
  }

  private _getOpportunityRepository(): OpportunityRepository {
    return Config.BREVO_API_ENABLED ? brevoRepository : brevoRepositoryMock
  }

  private _getOpportunityHubFeatures(): OpportunityHubFeatures {
    return new OpportunityHubFeatures([Config.PDE_API_ENABLED ? new PlaceDesEntreprises() : new PlaceDesEntreprisesMock()])
  }

  private _getProgramFeature(): ProgramFeatures {
    return new ProgramFeatures(ProgramsJson.getInstance())
  }

  private _getMailRepository(): MailerManager {
    return { sendReturnReceipt: Config.BREVO_API_ENABLED ? new BrevoMail().sendReturnReceipt : new BrevoMailMock().sendReturnReceipt }
  }
}
