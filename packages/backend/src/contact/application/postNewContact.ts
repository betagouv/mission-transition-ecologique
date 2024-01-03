import { addBrevoContact } from '../../infrastructure/brevo-API'
import { createService } from '../contact/contact-features'
import { ContactInfoRepository } from '../contact/spi'

/**
 * Defines how to access external data.
 * Uses the "Repository" pattern, see README.md
 */
const brevoRepository: ContactInfoRepository = {
  add: addBrevoContact
}
const service = createService(brevoRepository)

export const postNewContact = service.postNewContact
