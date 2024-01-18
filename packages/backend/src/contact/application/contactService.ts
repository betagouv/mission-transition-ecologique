import { Opportunity, OpportunityId } from '../domain/types'
import ContactFeatures from '../domain/contactFeatures'
import { Result } from 'true-myth'
import { addBrevoDeal, updateBrevoDeal } from '../infrastructure/api/brevo/brevoDeal'
import { addBrevoContact } from '../infrastructure/api/brevo/brevoContact'

export default class ContactService {
  private _contactFeatures: ContactFeatures

  constructor() {
    this._contactFeatures = new ContactFeatures(
      {
        createOrUpdate: addBrevoContact
      },
      { create: addBrevoDeal, update: updateBrevoDeal }
    )
  }

  public async createOpportunity(opportunity: Opportunity, optIn: boolean): Promise<Result<OpportunityId, Error>> {
    if (!optIn) {
      return Result.err(new Error('opt-in is required for storing contact data'))
    }
    return await this._contactFeatures.createOpportunity(opportunity, optIn)
  }
}
