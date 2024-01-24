import { Objectives } from '@tee/web/src/types'
import { QuestionnaireRoute } from '../infrastructure/api/brevo/types'
import { type Operators } from '@tee/data/src/generated/program'

export interface Opportunity extends ContactDetails, OpportunityDetails {}

export interface ContactDetails {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  companySiret: string
  companyName?: string
  companySector?: string
  companySize?: CompanySize
}

export interface OpportunityDetails {
  programId: string
  programContactOperator?: Operators
  message: string
  questionnaireRoute?: QuestionnaireRoute
  priorityObjectives?: Objectives[]
  sentToOperator?: boolean
}

export type OpportunityUpdateAttributes = Required<Pick<OpportunityDetails, 'sentToOperator'>>

export interface ContactId {
  id: number
}

export interface OpportunityId {
  id: string
}

// Taille de l'entreprise au sens communautaire
export enum CompanySize {
  TPE = 'TPE',
  PME = 'PME',
  ETI = 'ETI',
  GE = 'GE'
}
