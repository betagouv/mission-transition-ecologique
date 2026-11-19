import { Opportunity, OpportunityDetails, ThemeId } from '@tee/common'
import { ProgramType, ProjectType, Operators } from '@tee/data'

export type OpportunityWithContactId = Opportunity & {
  contactId: number
}

export type OpportunityWithOperatorContact = Opportunity & {
  programContactOperator?: Operators
  // Name of the partner whose API key authenticated the request (e.g. AGIR), never read from the request body
  partner?: string
}

export type OpportunityWithOperatorContactAndContactId = OpportunityWithContactId & OpportunityWithOperatorContact

export type OpportunityDetailsShort = Omit<OpportunityDetails, 'linkToCatalog' | 'message' | 'type' | 'theme'> & {
  programContactOperator?: Operators
}

export enum OpportunityHubTransmissionStatus {
  Sent = 'sent',
  Limited = 'limited',
  Failed = 'failed'
}

export type OpportunityUpdateAttributes =
  | { transmissionStatus: OpportunityHubTransmissionStatus.Sent; idCe: number }
  | { transmissionStatus: OpportunityHubTransmissionStatus.Limited | OpportunityHubTransmissionStatus.Failed }

export interface ContactId {
  id: number
}

export interface OpportunityId {
  id: string
}

export type OpportunityObjectDetails = ProgramType | ProjectType | CustomProject

export interface CustomProject {
  title: string
  theme?: ThemeId
}
