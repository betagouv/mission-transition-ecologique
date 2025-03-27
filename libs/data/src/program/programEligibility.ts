import { ProgramType } from './types/shared'
import { ProgramEligibilityType } from './types/shared'

export class ProgramEligibility {
  public static readonly ELIGIBLE_FOR_ALL = 'Éligible à toutes les entreprises'

  public static isEligible(program: ProgramType) {
    return program['eligibility'] === ProgramEligibilityType.Eligible || program['eligibility'] === ProgramEligibilityType.PartiallyEligible
  }

  public static isPartiallyEligible(program: ProgramType) {
    return (
      program["conditions d'éligibilité"]["autres critères d'éligibilité"] ||
      (program["conditions d'éligibilité"]["nombre d'années d'activité"] && !this.isYearsEligibleForAll(program))
    )
  }

  private static isYearsEligibleForAll(program: ProgramType) {
    return program["conditions d'éligibilité"]["nombre d'années d'activité"].includes(this.ELIGIBLE_FOR_ALL)
  }
}
