import { ThemeId } from '../../theme/types/shared'
import { ProgramTypeWithEligibility } from '../program'

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

export const enum FiltersKeys {
  Theme = 'theme'
}

export type ProgramFiltersType = {
  [FiltersKeys.Theme]?: ThemeId[]
}

export type ProgramTypeForFront = Exclude<ProgramTypeWithEligibility, 'publicodes'> & {
  filters: ProgramFiltersType
}
