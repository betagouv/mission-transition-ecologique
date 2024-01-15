import { addBrevoContact, updateBrevoContact } from '../infrastructure/api/brevo/brevoContact'
import { addBrevoDeal, updateBrevoDeal } from '../infrastructure/api/brevo/brevoDeal'
import { createService } from '../domain/contactFeatures'
import { ContactRepository, OpportunityRepository } from '../domain/spi'

/**
 * Defines how to access external data.
 * Uses the "Repository" pattern, see README.md
 */
const brevoContactRepository: ContactRepository = {
  create: addBrevoContact,
  update: updateBrevoContact
}

const brevoOpportunityRepository: OpportunityRepository = {
  create: addBrevoDeal,
  update: updateBrevoDeal
}

const service = createService(brevoContactRepository, brevoOpportunityRepository)

export const postNewOpportunity = service.postNewOpportunity
