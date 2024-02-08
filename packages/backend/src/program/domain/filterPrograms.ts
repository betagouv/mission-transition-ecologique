import Engine from 'publicodes'
import { Result } from 'true-myth'
import type { Program, PublicodesInputData, QuestionnaireData } from './types'
import { ensureError } from '../../common/domain/error/errors'
import { filterObject } from '../../common/objects'

/** Expected rule to evaluate if a program should be displayed to the user or
 * filtered out (in a program's `publicodes`
 * property).
 *  @constant
 *  @default
 */
export const FILTERING_RULE_NAME = 'entreprise . est ciblée'

/** Filter out programs for which the company is not eligible
 *
 * @param programs - A list of programs, holding data on their filtering
 *   rules (inside the `publicodes` property)
 * @param inputData - Data associated with the company or the user inputs.
 * @returns Programs from `programs` that are either eligible (rules evaluate
 *   to `true`) or which eligibility cannot be assessed (rules evaluate to
 *   `undefined`, for instance with missing data)
 */
export const filterPrograms = (programs: Program[], inputData: QuestionnaireData, currentDate: string): Result<Program[], Error> => {
  const filteredPrograms: Program[] = []

  for (const program of programs) {
    const evaluation = evaluateRule(program, inputData, currentDate)
    currentDate
    if (evaluation.isErr) {
      return Result.err(addErrorDetails(evaluation.error, program.id))
    }

    if (shouldKeepProgram(evaluation)) {
      filteredPrograms.push(program)
    }
  }

  return Result.ok(filteredPrograms)
}

const shouldKeepProgram = (evaluation: Result<boolean | undefined, Error>): boolean => {
  const isPositive = evaluation.isOk && evaluation.value
  const isUndefined = evaluation.isOk && typeof evaluation.value === 'undefined'

  return isPositive || isUndefined
}

/** Evaluates given program specific rules and user specific input data, if
 * the program should be displayed to the user.
 *
 * @param rules - An object encoding Publicode rules for a given program. The
 *   constant `FILTERING_RULE_NAME` determines which rule to evaluate, which is therefore
 *   mandatory.
 * @param questionnaireData - Data associated with the company or the user inputs. The
 *   data is expected to be using the exact same names as the variables in the
 *   `rules`.
 *
 * @returns Result that stores the rule evaluation (either a boolean or
 *   `undefined` if the input data does not allow to fully evaluate the rule) or
 *   the Error if any.
 */
const evaluateRule = (
  programData: Program,
  questionnaireData: QuestionnaireData,
  currentDate: string
): Result<boolean | undefined, Error> => {
  const rules = programData.publicodes

  let engine: Engine
  try {
    engine = new Engine(rules as object)
  } catch (e) {
    const err = ensureError(e)
    return Result.err(err)
  }

  const preprocessedData = preprocessInputForPublicodes(questionnaireData, programData, currentDate)

  const narrowedData = narrowInput(preprocessedData, engine)

  engine.setSituation(narrowedData)

  const evaluation = engine.evaluate(FILTERING_RULE_NAME)
  const eligibility = evaluation.nodeValue

  if (typeof eligibility !== 'boolean' && typeof eligibility !== 'undefined') {
    return Result.err(new Error(`"${FILTERING_RULE_NAME}" is expected to be a boolean or undefined`))
  }
  return Result.ok(eligibility)
}

/** Narrows input data to keep only keys expected inside the rules
 */
const narrowInput = (data: PublicodesInputData, engine: Engine): Partial<PublicodesInputData> => {
  const parsedRules = engine.getParsedRules()

  const allowed = Object.keys(parsedRules)

  return filterObject(data, (entry) => allowed.includes(entry[0]))
}

const addErrorDetails = (err: Error, programName: string): Error => {
  return new Error(`Evaluation of publicodes rules failed on program with id ${programName}`, {
    cause: err
  })
}

/** preprocesses the data gathered from the questionnaire into variables
 * needed by publicodes */
const preprocessInputForPublicodes = (
  questionnaireData: QuestionnaireData,
  programData: Program,
  currentDate: string
): PublicodesInputData => {
  const publicodesData: PublicodesInputData = {
    ...questionnaireData,
    'date du jour': currentDate
  }

  if (questionnaireData.codeNaf) publicodesData['entreprise . code NAF'] = enquotePublicodesLiteralString(questionnaireData.codeNaf)

  if (programData['début de validité']) publicodesData['dispositif . début de validité'] = programData['début de validité']
  if (programData['fin de validité']) publicodesData['dispositif . fin de validité'] = programData['fin de validité']

  return publicodesData
}

/** for publicodes to interpret a value as a literal string, it expects an
 * extra pair of quotes, added by this function. Without it, it is interpreted as a reference to another rule
 */
const enquotePublicodesLiteralString = (value: string): string => {
  return `"${value}"`
}
