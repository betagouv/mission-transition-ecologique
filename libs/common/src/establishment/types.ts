import { StructureSize, LegalCategory } from '../questionnaire/types/types'

export interface EstablishmentId {
  siret: string
}

export interface EstablishmentFront extends EstablishmentId {
  codeNAF: string
  codeNAF1: string
  ville: string
  codePostal: string
  legalCategory: LegalCategory | string
  region?: string | undefined
  structure_size?: StructureSize | undefined
  denomination?: string | undefined
  secteur: string
  creationDate: string
}

export interface EstablishmentSearch {
  establishments: EstablishmentFront[]
  resultCount: number
}

export enum NAF1 {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N',
  O = 'O',
  P = 'P',
  Q = 'Q',
  R = 'R',
  S = 'S',
  T = 'T',
  U = 'U'
}
