import type { Operators } from '@tee/data/src/generated/program'
import { Objectives } from '@tee/data/src/type/publicodesTypes'

export type Opportunity = ContactDetails & OpportunityDetails

export interface OpportunityBody {
  opportunity: Opportunity
  optIn: boolean
}

export interface ContactDetails {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  companySiret: string
  companyName?: string
  companySector?: string
  companySize?: number
}

export interface OpportunityDetails {
  programId: string
  programContactOperator?: Operators
  message: string
  questionnaireRoute?: QuestionnaireRoute
  priorityObjectives?: Objectives[]
  otherData?: string
}

export enum QuestionnaireRoute {
  Unknown = 'unknown',
  Precise = 'precise'
}
