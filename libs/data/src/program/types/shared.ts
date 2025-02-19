import { ThemeId } from '../../theme/types/shared'
import type { ProgramTypeWithEligibility } from '../program'

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

export const enum FilterKeys {
  Theme = 'theme'
}

export type ProgramFiltersType = {
  [FilterKeys.Theme]?: ThemeId[]
}

export type ProgramTypeWithFilters = ProgramTypeWithEligibility & {
  filters: ProgramFiltersType
}
