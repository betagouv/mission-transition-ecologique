import { Objectives, TrackHelpValue } from '@tee/web/src/types'

export interface Opportunity extends ContactDetails, OpportunityDetails {}

export interface ContactDetails {
  name: string
  forname: string
  email: string
  phone: string
  siret: string
  companyName?: string
  companySector?: string
  companySize?: Taille
}

export interface OpportunityDetails {
  programId: string
  message: string
  questionnaireRoute?: TrackHelpValue
  priorityObjectives?: Objectives[]
  sentToBpifrance: boolean
}

export type OpportunityUpdateAttributes = Pick<OpportunityDetails, 'sentToBpifrance'>

export interface ContactId {
  id: number
}

export interface OpportunityId {
  id: string
}

// Taille de l'entreprise au sens communautaire
export enum Taille {
  PME,
  ETI,
  GE
}
