import type { Maybe, Result } from 'true-myth'
import { ContactId, OpportunityId, OpportunityUpdateAttributes, OpportunityDetailsShort, OpportunityWithOperatorContact } from './types'
import { ContactDetails, Opportunity } from '@tee/common'
import { ProgramType } from '@tee/data'

export type ContactRepository = {
  createOrUpdate: (contact: ContactDetails, optIn: true) => Promise<Result<ContactId, Error>>
}

export type OpportunityRepository = {
  create: (contactId: number, opportunity: OpportunityWithOperatorContact) => Promise<Result<OpportunityId, Error>>
  update: (dealId: OpportunityId, attributes: OpportunityUpdateAttributes) => Promise<Maybe<Error>>
  readDates: () => Promise<Result<Date[], Error>>
  getDailyOpportunitiesByContactId: (contactId: number) => Promise<Result<OpportunityDetailsShort[], Error>>
}

export type MailerManager = {
  sendReturnReceipt: (opportunity: Opportunity, program: ProgramType) => Promise<Maybe<Error> | void>
}
