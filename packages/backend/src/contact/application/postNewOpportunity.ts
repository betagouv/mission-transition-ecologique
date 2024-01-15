<<<<<<< HEAD:packages/backend/src/contact/application/postNewOpportunity.ts
=======
import { addBrevoContact, updateBrevoContact } from '../infrastructure/api/brevo/brevo'
>>>>>>> origin/feature/api-bpifrance:packages/backend/src/contact/application/postNewContact.ts
import { createService } from '../domain/contactFeatures'
import { ContactInfoRepository } from '../domain/spi'

import { addBrevoContact } from '../infrastructure/api/brevo/brevoContact'
import { addBrevoOpportunity } from '../infrastructure/api/brevo/brevoDeal'

/**
 * Defines how to access external data.
 * Uses the "Repository" pattern, see README.md
 */
const brevoContactRepository: ContactRepository = {
  create: addBrevoContact,
  update: updateBrevoContact
}

const brevoOpportunityRepository: OpportunityRepository = {
  create: addBrevoOpportunity
}

const service = createService(brevoContactRepository)

export const postNewOpportunity = service.postNewOpportunity
