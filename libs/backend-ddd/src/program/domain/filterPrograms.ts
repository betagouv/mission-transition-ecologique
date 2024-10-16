import { Result } from 'true-myth'
import { RulesManager } from './spi'
import { ProgramEligibilityType, ProgramType, ProgramTypeWithEligibility } from '@tee/data'
import { QuestionnaireData } from '@tee/common'

/** Expected rule to evaluate if a program should be displayed to the user or
 * filtered out (in a program's `publicodes`
 * property).
 *  @constant
 *  @default
 */
export const FILTERING_RULE_NAME = 'entreprise . est ciblée'

/** Filter out programs for which the company is not eligible
 *
 * @returns Programs from `programs` that are either eligible (rules evaluate
 *   to `true`) or which eligibility cannot be assessed (rules evaluate to
 *   `undefined`, for instance with missing data)
 */
export const filterPrograms = (
  programs: ProgramType[],
  inputData: QuestionnaireData,
  currentDate: string,
  rulesService: RulesManager
): Result<ProgramTypeWithEligibility[], Error> => {
  const filteredPrograms: ProgramTypeWithEligibility[] = []

  for (const program of programs) {
    const evaluation = rulesService.evaluate(FILTERING_RULE_NAME, program, inputData, currentDate)

    if (evaluation.isErr) {
      return Result.err(addErrorDetails(evaluation.error, program.id))
    }

    // since publicodes return a single boolean or undefined value and we want to know if ineligible programs
    // are ineligible because of the inputData of because of their EOL, we need an other publicodes evaluation for this specific question
    let dateEvaluation: Result<boolean | undefined, Error> = Result.ok(true)
    if (inputData.onlyEligible !== true) {
      dateEvaluation = rulesService.evaluate(FILTERING_RULE_NAME, program, {}, currentDate)
    }
    if (dateEvaluation.isErr) {
      return Result.err(addErrorDetails(dateEvaluation.error, program.id))
    }

    const programWithElibibility = setEligibility(program, evaluation.value, dateEvaluation.value)

    if (shouldKeepProgram(programWithElibibility.eligibility, inputData.onlyEligible)) {
      filteredPrograms.push(programWithElibibility)
    }
  }

  return Result.ok(filteredPrograms)
}

const addErrorDetails = (err: Error, programName: string): Error => {
  return new Error(`Evaluation of rule failed on program with id ${programName}`, {
    cause: err
  })
}

const shouldKeepProgram = (programEligibility: ProgramEligibilityType, onlyEligible: boolean | undefined): boolean => {
  if (programEligibility === ProgramEligibilityType.ProgramEol) {
    return false
  }

  if (onlyEligible === false) {
    return true
  }

  return programEligibility !== ProgramEligibilityType.NotEligible
}

const setEligibility = (
  program: ProgramType,
  evaluationValue: boolean | undefined,
  dateEvaluation: boolean | undefined
): ProgramTypeWithEligibility => {
  let eligibility: ProgramEligibilityType

  if (dateEvaluation === false) {
    eligibility = ProgramEligibilityType.ProgramEol
    return { ...program, eligibility }
  }

  const isEligible = typeof evaluationValue === 'undefined' || evaluationValue
  // if (typeof evaluationValue === 'undefined') {
  //   eligibility = ProgramEligibilityType.Unknown
  // }
  // TODO, analyse the undefined returns from publicodes
  // there are a dozen of programs that return 'undefined' values.
  if (isEligible && program["conditions d'éligibilité"]["autres critères d'éligibilité"]) {
    eligibility = ProgramEligibilityType.PartiallyEligible
  } else if (isEligible) {
    eligibility = ProgramEligibilityType.Eligible
  } else {
    eligibility = ProgramEligibilityType.NotEligible
  }

  return { ...program, eligibility }
}
