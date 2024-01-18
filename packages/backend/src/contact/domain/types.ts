import { Objectives, TrackHelpValue } from '@tee/web/src/types'

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
  questionnaireRoute?: TrackHelpValue
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
  PME = 'PME',
  ETI = 'ETI',
  GE = 'GE'
}
