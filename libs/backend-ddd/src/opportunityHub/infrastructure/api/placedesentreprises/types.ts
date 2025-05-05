export interface GetLandingResponseData {
  data: Landing[]
  metadata: Metadata
}

interface Theme {
  id: number
  title: string
  slug: string
  description: string
}

export interface Landing {
  id: number
  title: string
  slug: string
  partner_url: string
  landing_themes: Theme[]
}

interface Metadata {
  total_results: number
}

export enum Subject {
  DemarcheEcologie = 'demarche-ecologie',
  Energie = 'energie',
  Eau = 'eau',
  TransportMobilite = 'transport-mobilite',
  Dechets = 'dechets',
  BilanRSE = 'bilan-rse'
}

export const subjectToIdMapping: { [key in Subject]: number } = {
  [Subject.DemarcheEcologie]: 21,
  [Subject.Energie]: 22,
  [Subject.Eau]: 24,
  [Subject.TransportMobilite]: 25,
  [Subject.Dechets]: 23,
  [Subject.BilanRSE]: 26
}

export interface CreateSolicitationApiBody {
  solicitation: Solicitation
}
export interface Solicitation {
  landing_id: number
  landing_subject_id: number
  description: string
  full_name: string
  email: string
  phone_number: string
  siret: string
  origin_url?: string
}
