// FOR AID PROGRAMS

export enum ProgramAidType {
  acc = 'accompagnement',
  train = 'formation',
  fund = 'financement',
  loan = 'prêt',
  tax = 'avantage fiscal'
}

export interface ProgramData {
  id: string
  titre: string
  promesse: string
  description: string
  'description longue'?: string
  illustration: string
  objectifs: string[]
  'opérateur de contact': string
  'autres opérateurs'?: string[]
  "nature de l'aide": ProgramAidType

  "coût de l'accompagnement"?: string
  "durée de l'accompagnement"?: string
  'montant du financement'?: string
  "montant de l'avantage fiscal"?: string
  'montant du prêt'?: string
  'durée du prêt'?: string
  'taux du prêt'?: string
  url?: string

  publicodes: Object

  // program_conditions?: ProgramConditions,
  // program_application?: any,
  // geo_zones?: any,
  // program_cost?: any,
  // program_duration?: any,
  // date_start?: any,
  // date_end?: any
}
