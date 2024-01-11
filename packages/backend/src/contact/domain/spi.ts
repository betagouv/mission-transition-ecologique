import type { Result } from 'true-myth'
import type { ContactId, DealId, ContactDetails, OpportunityDetails } from './types'

export type ContactInfoRepository = {
  // add contact or update it if contact with same email exists
  addContact: (contact: ContactDetails, optIn: true) => Promise<Result<ContactId, Error>>
  addOpportunity: (contactId: number, opportunity: OpportunityDetails) => Promise<Result<DealId, Error>>
}
