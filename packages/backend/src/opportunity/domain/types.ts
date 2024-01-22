import { Objectives } from '@tee/web/src/types'
import { QuestionnaireRoute } from '../infrastructure/api/brevo/types'

export interface Opportunity extends ContactDetails, OpportunityDetails {}

export interface ContactDetails {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  companySiret: string
  companyName?: string
  companySector?: string
  companySize?: Taille
}

export interface OpportunityDetails {
  programId: string
  message: string
  questionnaireRoute?: QuestionnaireRoute
  priorityObjectives?: Objectives[]
  sentToBpifrance?: boolean
}

export type OpportunityUpdateAttributes = Required<Pick<OpportunityDetails, 'sentToBpifrance'>>

export interface ContactId {
  id: number
}

export interface OpportunityId {
  id: string
}

// Taille de l'entreprise au sens communautaire
export enum Taille {
  TPE = 'TPE',
  PME = 'PME',
  ETI = 'ETI',
  GE = 'GE'
}
