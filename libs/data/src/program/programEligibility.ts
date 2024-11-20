import { ProgramType } from './program'

export class ProgramEligibility {
  public static readonly ELIGIBLE_FOR_ALL = 'Éligible à toutes les entreprises'

  public static isPartiallyEligible(program: ProgramType) {
    return program["conditions d'éligibilité"]["autres critères d'éligibilité"] || !this.isYearsEligibleForAll(program)
  }

  private static isYearsEligibleForAll(program: ProgramType) {
    return this.ELIGIBLE_FOR_ALL in program["conditions d'éligibilité"]["nombre d'années d'activité"]
  }
}
