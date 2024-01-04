import { addBrevoContact } from '../infrastructure/api/brevo/brevo'
import { createService } from '../domain/contactFeatures'
import { ContactInfoRepository } from '../domain/spi'

/**
 * Defines how to access external data.
 * Uses the "Repository" pattern, see README.md
 */
const brevoRepository: ContactInfoRepository = {
  add: addBrevoContact
}
const service = createService(brevoRepository)

export const postNewContact = service.postNewContact
