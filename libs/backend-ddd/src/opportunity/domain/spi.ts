import type { Maybe, Result } from 'true-myth'
import { OpportunityAssociatedData } from './opportunityAssociatedData'
import {
  ContactId,
  OpportunityId,
  OpportunityUpdateAttributes,
  OpportunityDetailsShort,
  OpportunityWithOperatorContactAndContactId
} from './types'
import { ContactDetails, Opportunity } from '@tee/common'

export type ContactRepository = {
  createOrUpdate: (contact: ContactDetails, optIn: true) => Promise<Result<ContactId, Error>>
}

export type OpportunityRepository = {
  create: (
    opportunity: OpportunityWithOperatorContactAndContactId,
    opportunityAssociatedObject: OpportunityAssociatedData
  ) => Promise<Result<OpportunityId, Error>>
  update: (dealId: OpportunityId, attributes: OpportunityUpdateAttributes) => Promise<Maybe<Error>>
  readDates: () => Promise<Result<Date[], Error>>
  getDailyOpportunitiesByContactId: (contactId: number) => Promise<Result<OpportunityDetailsShort[], Error>>
}

export type MailerManager = {
  sendReturnReceipt: (opportunity: Opportunity, associatedData: OpportunityAssociatedData) => Promise<Maybe<Error> | void>
}
