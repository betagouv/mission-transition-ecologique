import { Result } from 'true-myth'
import { addBrevoContact } from '../infrastructure/api/brevo/brevo'
import { createService } from '../domain/contactFeatures'
import { ContactInfoRepository } from '../domain/spi'
import { DealId } from '../domain/types'

/**
 * Defines how to access external data.
 * Uses the "Repository" pattern, see README.md
 */
const brevoRepository: ContactInfoRepository = {
  addContact: addBrevoContact,
  addOpportunity: async (_contactId: number, _attributes: object): Promise<Result<DealId, Error>> => {
    const res: Result<DealId, Error> = Result.ok({ id: '1' })
    return res
  }
}
const service = createService(brevoRepository)

export const postNewOpportunity = service.postNewOpportunity
