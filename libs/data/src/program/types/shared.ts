import { ThemeId } from '@tee/common'
import type { Dispositif as ProgramWithoutId } from './program'

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

export type { ProgramWithoutId }
export type ProgramType = ProgramWithoutId & {
  eligibility_data: EligibilityData
  id: string
}

export interface EligibilityData {
  validity?: {
    start?: string
    end?: string
  }
  company: {
    minEmployees?: number
    maxEmployees?: number
    excludeMicroentrepreneur?: boolean
    allowedNafSections: string[]
    allowedRegion?: string[]
  }
  questionnaire?: {
    priorityObjectives?: string[]
  }
}

export type ProgramTypeWithEligibility = ProgramType & {
  eligibility: ProgramEligibilityType
}

export type ProgramTypeForFront = Exclude<ProgramTypeWithEligibility, 'publicodes'> & {
  filters?: ProgramFiltersType
}
