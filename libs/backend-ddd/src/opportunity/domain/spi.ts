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

// monitorTags: Sentry tags of the opportunity workflow (partner), added to the errors reported by the repositories
type MonitorTags = { [key: string]: string }

export type ContactRepository = {
  createOrUpdate: (contact: ContactDetails, optIn: true, monitorTags: MonitorTags) => Promise<Result<ContactId, Error>>
}

export type OpportunityRepository = {
  create: (
    opportunity: OpportunityWithOperatorContactAndContactId,
    opportunityAssociatedObject: OpportunityAssociatedData
  ) => Promise<Result<OpportunityId, Error>>
  update: (dealId: OpportunityId, attributes: OpportunityUpdateAttributes, monitorTags: MonitorTags) => Promise<Maybe<Error | null>>
  readDates: () => Promise<Result<Date[], Error>>
  getDailyOpportunitiesByContactId: (contactId: number, monitorTags: MonitorTags) => Promise<Result<OpportunityDetailsShort[], Error>>
}

export type MailerManager = {
  sendReturnReceipt: (opportunity: Opportunity, associatedData: OpportunityAssociatedData) => Promise<Maybe<Error> | void>
}
