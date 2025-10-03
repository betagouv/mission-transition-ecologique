import { Result } from 'true-myth'
import { EligibilityEvaluator } from './spi'
import { ProgramEligibilityType, ProgramType, ProgramTypeWithEligibility } from '@tee/data'
import { QuestionnaireData } from '@tee/common'
import { ProgramEligibility } from '@tee/data'
import { ProgramEligibilityEvaluator } from './programEligibilityEvaluator'

/** Filter out programs for which the company is not eligible
 *
 * @returns Programs from `programs` that are either eligible (rules evaluate
 *   to `true`) or which eligibility cannot be assessed (rules evaluate to
 *   `undefined`, for instance with missing data)
 */
export const filterPrograms = (
  programs: ProgramType[],
  inputData: QuestionnaireData,
  rulesService: EligibilityEvaluator
): Result<ProgramTypeWithEligibility[], Error> => {
  const filteredPrograms: ProgramTypeWithEligibility[] = []

  for (const program of programs) {
    const programWithElibibility = evaluateProgramEligibility(program, inputData, rulesService)
    if (programWithElibibility.isErr) {
      return Result.err(addErrorDetails(programWithElibibility.error, program.id))
    }

    if (shouldKeepProgram(programWithElibibility.value.eligibility, inputData.onlyEligible)) {
      filteredPrograms.push(programWithElibibility.value)
    }
  }

  return Result.ok(filteredPrograms)
}

export const evaluateProgramEligibility = (
  program: ProgramType,
  inputData: QuestionnaireData,
  rulesService: EligibilityEvaluator
): Result<ProgramTypeWithEligibility, Error> => {
  console.time('publicodes')
  const evaluation = rulesService.evaluate(program, inputData)

  if (evaluation.isErr) {
    return Result.err(addErrorDetails(evaluation.error, program.id))
  }

  // since publicodes return a single boolean or undefined value and we want to know if ineligible programs
  // are ineligible because of the inputData of because of their EOL, we need an other publicodes evaluation for this specific question
  const dateEvaluation = rulesService.evaluate(program, {})
  if (dateEvaluation.isErr) {
    return Result.err(addErrorDetails(dateEvaluation.error, program.id))
  }
  console.timeEnd('publicodes')

  const programWithElibibility = setEligibility(program, evaluation.value, dateEvaluation.value)

  const evaluator = new ProgramEligibilityEvaluator()
  console.time('directjson')

  const newFullDataEvaluation = evaluator.evaluate(program, inputData)
  const newdateEvaluation = evaluator.evaluate(program, {})
  console.timeEnd('directjson')

  if (newFullDataEvaluation.isErr || newdateEvaluation.isErr) {
    return Result.err(new Error('new elibigility evaluator error'))
  }

  const newEvaluation = setEligibility(program, newFullDataEvaluation.value, newdateEvaluation.value)

  if (programWithElibibility.eligibility != newEvaluation.eligibility) {
    console.log('conflicting results', programWithElibibility.id)
    console.log(programWithElibibility.eligibility, evaluation.value, dateEvaluation.value)
    console.log(newEvaluation.eligibility, newFullDataEvaluation.value, newdateEvaluation.value)
  }
  return Result.ok(programWithElibibility)
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
  if (isEligible) {
    eligibility = ProgramEligibility.isPartiallyEligible(program)
      ? ProgramEligibilityType.PartiallyEligible
      : ProgramEligibilityType.Eligible
  } else {
    eligibility = ProgramEligibilityType.NotEligible
  }

  return { ...program, eligibility }
}
