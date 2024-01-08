import { createService } from '../domain/contactFeatures'
import { ContactInfoRepository } from '../domain/spi'

import { addBrevoContact } from '../infrastructure/api/brevo/brevoContact'
import { addBrevoOpportunity } from '../infrastructure/api/brevo/brevoDeal'

/**
 * Defines how to access external data.
 * Uses the "Repository" pattern, see README.md
 */
const brevoRepository: ContactInfoRepository = {
  addContact: addBrevoContact,
  addOpportunity: addBrevoOpportunity
}
const service = createService(brevoRepository)

export const postNewOpportunity = service.postNewOpportunity
