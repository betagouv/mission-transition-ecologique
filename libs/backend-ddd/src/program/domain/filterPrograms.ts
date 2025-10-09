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
  const filteredProgramsByJson: ProgramTypeWithEligibility[] = []

  console.time('publicodes - All Programs')
  for (const program of programs) {
    const programWithEligibility = evaluateProgramEligibility(program, inputData, rulesService)
    if (programWithEligibility.isErr) {
      return Result.err(addErrorDetails(programWithEligibility.error, program.id))
    }

    if (shouldKeepProgram(programWithEligibility.value.eligibility, inputData.onlyEligible)) {
      filteredPrograms.push(programWithEligibility.value)
    }
  }
  console.timeEnd('publicodes - All Programs')

  console.time('directjson - All Programs')
  for (const program of programs) {
    const programWithEligibility = evaluateProgramEligibilityByJson(program, inputData)
    if (programWithEligibility.isErr) {
      return Result.err(addErrorDetails(programWithEligibility.error, program.id))
    }

    if (shouldKeepProgram(programWithEligibility.value.eligibility, inputData.onlyEligible)) {
      filteredProgramsByJson.push(programWithEligibility.value)
    }
  }
  console.timeEnd('directjson - All Programs')

  for (const filteredProgram of filteredPrograms) {
    const filteredProgramByJson = filteredProgramsByJson.find((program) => program.id === filteredProgram.id)
    if (filteredProgramByJson && filteredProgram.eligibility != filteredProgramByJson.eligibility) {
      console.log('conflicting results', filteredProgram.id)
      console.log(filteredProgram.eligibility)
      console.log(filteredProgramByJson.eligibility)
    }
  }

  return Result.ok(filteredPrograms)
}

export const evaluateProgramEligibility = (
  program: ProgramType,
  inputData: QuestionnaireData,
  rulesService: EligibilityEvaluator
): Result<ProgramTypeWithEligibility, Error> => {
  console.time('publicodes - program : ' + program.id)
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
  console.timeEnd('publicodes - program : ' + program.id)

  const programWithElibibility = setEligibility(program, evaluation.value, dateEvaluation.value)

  return Result.ok(programWithElibibility)
}

export const evaluateProgramEligibilityByJson = (
  program: ProgramType,
  inputData: QuestionnaireData
): Result<ProgramTypeWithEligibility, Error> => {
  const evaluator = new ProgramEligibilityEvaluator()
  console.time('directjson - program : ' + program.id)

  const newFullDataEvaluation = evaluator.evaluate(program, inputData)
  const newDateEvaluation = evaluator.evaluate(program, {})
  console.timeEnd('directjson - program : ' + program.id)

  if (newFullDataEvaluation.isErr || newDateEvaluation.isErr) {
    return Result.err(new Error('new elibigility evaluator error'))
  }

  const programWithEligibility = setEligibility(program, newFullDataEvaluation.value, newDateEvaluation.value)

  return Result.ok(programWithEligibility)
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
