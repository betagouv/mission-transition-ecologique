import type { Result } from 'true-myth'
import type { ContactId, DealId } from './types'

export type ContactInfoRepository = {
  // add contact or update it if contact with same email exists
  addContact: (email: string, attributes: object) => Promise<Result<ContactId, Error>>
  addOpportunity: (contactId: number, attributes: object) => Promise<Result<DealId, Error>>
}
