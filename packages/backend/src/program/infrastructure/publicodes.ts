import Engine from 'publicodes'
import { Result } from 'true-myth'
import type { Program, QuestionnaireData } from '../domain/types'
import type { PublicodesInputData } from './types'
import { filterObject } from '../../common/objects'
import { preprocessInputForPublicodes } from './preprocessProgramsPublicodes'

/** Evaluates given program specific rules and user specific input data, if
 * the program should be displayed to the user.
 *
 * @returns Result that stores the rule evaluation (either a boolean or
 *   `undefined` if the input data does not allow to fully evaluate the rule) or
 *   the Error if any.
 */
export const evaluateRule = (
  rule: string,
  engine: Engine,
  programData: Program,
  questionnaireData: QuestionnaireData,
  currentDate: string
): Result<boolean | undefined, Error> => {
  const preprocessedData = preprocessInputForPublicodes(questionnaireData, programData, currentDate)

  const narrowedData = narrowInput(preprocessedData, engine)

  engine.setSituation(narrowedData)

  const evaluation = engine.evaluate(rule)
  const eligibility = evaluation.nodeValue

  if (typeof eligibility !== 'boolean' && typeof eligibility !== 'undefined') {
    return Result.err(new Error(`"${rule}" is expected to be a boolean or undefined`))
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
