import type { Result } from 'true-myth'
import type {
  ContactId,
  OpportunityId,
  ContactDetails,
  OpportunityDetails,
  ContactUpdateAttributes,
  OpportunityUpdateAttributes
} from './types'

export type ContactRepository = {
  create: (contact: ContactDetails, optIn: true) => Promise<Result<ContactId, Error>>
  update: (contactId: ContactId, attributes: ContactUpdateAttributes) => Promise<Result<ContactId, Error>>
}

export type OpportunityRepository = {
  // add contact or update it if contact with same email exists
  create: (contactId: number, opportunity: OpportunityDetails) => Promise<Result<OpportunityId, Error>>
  update: (dealId: OpportunityId, attributes: OpportunityUpdateAttributes) => Promise<Result<OpportunityId, Error>>
}
