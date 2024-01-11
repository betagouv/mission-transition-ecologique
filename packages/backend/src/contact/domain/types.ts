import { Objectives, TrackHelpValue } from '@tee/web/src/types'
import { CustomError } from '../../common/errors'

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
  questionnaireRoute?: TrackHelpValue
  priorityObjectives?: Objectives[]
}

export interface ContactId {
  id: number
}

export interface DealId {
  id: string
}

export class ServiceNotFoundError extends CustomError {}

// Taille de l'entreprise au sens communautaire
export enum Taille {
  PME,
  ETI,
  GE
}
