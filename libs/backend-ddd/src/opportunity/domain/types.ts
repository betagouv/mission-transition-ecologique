import { Opportunity, OpportunityDetails } from '@tee/common'
import { Operators } from '@tee/data'

export type OpportunityWithContactId = Opportunity & {
  contactId: number
}

export type OpportunityWithOperatorContact = Opportunity & { programContactOperator?: Operators }

export type OpportunityDetailsShort = Omit<OpportunityDetails, 'linkToPage' | 'message' | 'type'> & { programContactOperator?: Operators }

export interface OpportunityUpdateAttributes {
  sentToOpportunityHub: boolean
}

export interface ContactId {
  id: number
}

export interface OpportunityId {
  id: string
}
