import { Opportunity, OpportunityDetails } from '@tee/common'

export type OpportunityWithContactId = Opportunity & {
  contactId: number
}

export type OpportunityDetailsShort = Omit<OpportunityDetails, 'linkToProgramPage' | 'message'>

export interface OpportunityUpdateAttributes {
  sentToOpportunityHub: boolean
}

export interface ContactId {
  id: number
}

export interface OpportunityId {
  id: string
}
