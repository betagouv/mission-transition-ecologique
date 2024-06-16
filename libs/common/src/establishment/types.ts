import { StructureSize } from '../questionnaire/types'

export interface EstablishmentId {
  siret: string
}

export interface EstablishmentFront extends EstablishmentId {
  codeNAF: string
  codeNAF1: string
  ville: string
  codePostal: string
  region: string | undefined
  structure_size: StructureSize | undefined
  denomination: string | undefined
  secteur: string
  creationDate: string
}

export interface EstablishmentSearch {
  establishments: EstablishmentFront[]
  resultCount: number
}
