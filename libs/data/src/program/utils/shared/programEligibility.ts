import { ProgramType, ProgramTypeForFront } from '../../types/shared'
import { ProgramEligibilityStatus } from '../../types/shared'

export class ProgramEligibility {
  public static readonly ELIGIBLE_FOR_ALL = 'Éligible à toutes les entreprises'

  public static isEligible(program: ProgramType | ProgramTypeForFront) {
    return (
      program['eligibility'] === ProgramEligibilityStatus.Eligible || program['eligibility'] === ProgramEligibilityStatus.PartiallyEligible
    )
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
