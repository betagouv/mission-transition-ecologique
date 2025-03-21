import { StructureSize, LegalCategory } from '../questionnaire/types/types'

export interface EstablishmentFront {
  codeNAF: string
  codeNAF1: string
  ville: string
  codePostal: string
  siret?: string
  legalCategory?: LegalCategory | string
  region?: string | undefined
  structure_size?: StructureSize | undefined
  denomination?: string | undefined
  secteur: string
  creationDate?: string
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

export interface CompanyActivityType {
  codeNAF: string
  codeNAF1: NAF1
  secteur: string
}
