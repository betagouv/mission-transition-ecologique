import { Opportunity, OpportunityId } from '../domain/types'
import OpportuntiyFeatures from '../domain/opportunityFeatures'
import { Result } from 'true-myth'
import { brevoRepository } from '../infrastructure/api/brevo/brevoDeal'
import { addBrevoContact } from '../infrastructure/api/brevo/brevoContact'
import { OperatorRepository } from '../../operator/domain/spi'
// import { BpiFrance } from '../../operator/infrastructure/api/bpi/bpiFrance'
import { ContactRepository, MailerService, OpportunityRepository, PDEService } from '../domain/spi'
import { ProgramRepository } from '../../program/domain/spi'
import ProgramsJson from '../../program/infrastructure/programsJson'
import BrevoMail from '../infrastructure/api/brevo/brevoMail'
import { PDE } from '../infrastructure/api/pde/placeDesEntreprises'

export default class OpportunityInjector {
  private _opportunityFeatures: OpportuntiyFeatures

  constructor() {
    this._opportunityFeatures = new OpportuntiyFeatures(
      this._getContactRepository(),
      this._getOpportunityRepository(),
      this._getOperatorRepositories(),
      this._getProgramRepository(),
      this._getMailRepository(),
      this._getPDEService()
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
      createOrUpdate: addBrevoContact
    }
  }

  private _getOpportunityRepository(): OpportunityRepository {
    return brevoRepository
  }

  private _getOperatorRepositories(): OperatorRepository[] {
    return []
  }

  private _getProgramRepository(): ProgramRepository {
    return ProgramsJson.getInstance()
  }

  private _getMailRepository(): MailerService {
    return { sendReturnReceipt: new BrevoMail().sendReturnReceipt }
  }

  private _getPDEService(): PDEService {
    return { getLandingId: new PDE().getLandingId }
  }

  public async getPDELandingID(): Promise<Result<number, Error>> {
    return this._opportunityFeatures.getPDELandingID()
  }
}
