import { Opportunity, OpportunityDetails } from '@tee/common'
import { Operators } from '@tee/data'
import { ProgramType, Project } from '@tee/data'

export type OpportunityWithContactId = Opportunity & {
  contactId: number
}

export type OpportunityWithOperatorContact = Opportunity & { programContactOperator?: Operators }

export type OpportunityWithOperatorContactAndContactId = OpportunityWithContactId & OpportunityWithOperatorContact

export type OpportunityDetailsShort = Omit<OpportunityDetails, 'linkToPage' | 'linkToCatalog' | 'message' | 'type' | 'theme'> & {
  programContactOperator?: Operators
}

export interface OpportunityUpdateAttributes {
  sentToOpportunityHub: boolean
}

export interface ContactId {
  id: number
}

export interface OpportunityId {
  id: string
}

export type OpportunityObjectDetails = ProgramType | Project | CustomProject

export interface CustomProject {
  title: string
}
