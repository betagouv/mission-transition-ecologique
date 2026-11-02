import { Opportunity, OpportunityDetails, ThemeId } from '@tee/common'
import { ProgramType, ProjectType, Operators } from '@tee/data'

export type OpportunityWithContactId = Opportunity & {
  contactId: number
}

export type OpportunityWithOperatorContact = Opportunity & { programContactOperator?: Operators }

export type OpportunityWithOperatorContactAndContactId = OpportunityWithContactId & OpportunityWithOperatorContact

export type OpportunityDetailsShort = Omit<OpportunityDetails, 'linkToPage' | 'linkToCatalog' | 'message' | 'type' | 'theme'> & {
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
