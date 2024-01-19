import { Opportunity, OpportunityId } from '../domain/types'
import ContactFeatures from '../domain/contactFeatures'
import { Result } from 'true-myth'
import { addBrevoDeal, updateBrevoDeal } from '../infrastructure/api/brevo/brevoDeal'
import { addBrevoContact } from '../infrastructure/api/brevo/brevoContact'
import { OperatorRepository } from '../../operator/domain/spi'
import { BpiFrance } from '../../operator/infrastructure/api/bpi/bpiFrance'
import { ContactRepository, OpportunityRepository } from '../domain/spi'
import { ProgramRepository } from '../../program/domain/spi'
import ProgramsJson from '../../program/infrastructure/programsJson'

export default class OpportunityService {
  private _contactFeatures: ContactFeatures

  constructor() {
    this._contactFeatures = new ContactFeatures(
      this.getContactRepository(),
      this.getOpportunityRepository(),
      this.getOperatorRepositories(),
      this.getProgramRepository()
    )
  }

  public async createOpportunity(opportunity: Opportunity, optIn: boolean): Promise<Result<OpportunityId, Error>> {
    if (!optIn) {
      return Result.err(new Error('opt-in is required for storing contact data'))
    }
    return await this._contactFeatures.createOpportunity(opportunity, optIn)
  }

  private getContactRepository(): ContactRepository {
    return {
      createOrUpdate: addBrevoContact
    }
  }

  private getOpportunityRepository(): OpportunityRepository {
    return { create: addBrevoDeal, update: updateBrevoDeal }
  }

  private getOperatorRepositories(): OperatorRepository[] {
    return [new BpiFrance()]
  }

  private getProgramRepository(): ProgramRepository {
    return ProgramsJson.getInstance()
  }
}
