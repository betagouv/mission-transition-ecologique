import type { Maybe, Result } from 'true-myth'
import type { ContactId, OpportunityId, OpportunityUpdateAttributes, OpportunityDetailsShort } from './types'
import { ContactDetails, Opportunity, OpportunityDetails } from '@tee/common'
import { Program } from '@tee/data'

export type ContactRepository = {
  createOrUpdate: (contact: ContactDetails, optIn: true) => Promise<Result<ContactId, Error>>
}

export type OpportunityRepository = {
  create: (contactId: number, opportunity: OpportunityDetails) => Promise<Result<OpportunityId, Error>>
  update: (dealId: OpportunityId, attributes: OpportunityUpdateAttributes) => Promise<Maybe<Error>>
  readDates: () => Promise<Result<Date[], Error>>
  getDailyOpportunitiesByContactId: (contactId: number) => Promise<Result<OpportunityDetailsShort[], Error>>
}

export type MailerService = {
  sendReturnReceipt: (opportunity: Opportunity, program: Program) => Promise<Maybe<Error> | void>
}
