import { ProgramType } from '../program'

export enum ProgramAidType {
  study = 'étude',
  train = 'formation',
  fund = 'financement',
  loan = 'prêt',
  tax = 'avantage fiscal'
}

export enum ProgramEligibilityType {
  Eligible = 'eligible',
  PartiallyEligible = 'partially-eligible',
  NotEligible = 'not-eligible',
  ProgramEol = 'program-end-of-life',
  Unknown = 'unknown'
}
export const ELIGIBLE_FOR_ALL = 'Éligible à toutes les entreprises'

export const isYearsEligibleForAll = (program: ProgramType) => {
  return ELIGIBLE_FOR_ALL in program["conditions d'éligibilité"]["nombre d'années d'activité"]
}
