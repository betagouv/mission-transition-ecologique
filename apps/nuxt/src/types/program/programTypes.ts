import { ThemeId, ProgramAidType, FiltersKeys, Operators, ProgramEligibilityType } from '@/types'

interface ProgramObjectiveLink {
  lien: string
  texte: string
}

interface ProgramObjective {
  description: string
  liens: ProgramObjectiveLink[]
}

export interface ProgramData {
  id: string
  titre: string
  promesse: string
  description?: string
  'description longue'?: string
  'début de validité'?: string
  'fin de validité'?: string
  'aide temporairement indisponible'?: string
  illustration: string
  objectifs: ProgramObjective[]
  'opérateur de contact': Operators
  'autres opérateurs'?: Operators[]
  "nature de l'aide": ProgramAidType
  'activable en autonomie'?: string
  "coût de l'accompagnement"?: string
  'montant du financement'?: string
  "montant de l'avantage fiscal"?: string
  'montant du prêt'?: string
  "durée de l'accompagnement"?: string
  'durée du prêt'?: string
  url?: string
  eligibility: ProgramEligibilityType

  "conditions d'éligibilité": {
    "taille de l'entreprise": string[]
    'secteur géographique': string[]
    "secteur d'activité": string[]
    "nombre d'années d'activité": string[]
    "autres critères d'éligibilité"?: string[]
  }

  filters: FiltersProgramData
}

export type FiltersProgramData = {
  [FiltersKeys.Theme]?: ThemeId[]
}
