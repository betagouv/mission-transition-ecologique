import Engine from 'publicodes'
import { Result } from 'true-myth'
import type { Program, QuestionnaireData } from '../domain/types'
import type { PublicodesInputData } from './types'
import { ensureError } from '../../common/domain/error/errors'
import { filterObject } from '../../common/objects'
import { preprocessInputForPublicodes } from './preprocessProgramsPublicodes'

/** Evaluates given program specific rules and user specific input data, if
 * the program should be displayed to the user.
 *
 * @returns Result that stores the rule evaluation (either a boolean or
 *   `undefined` if the input data does not allow to fully evaluate the rule) or
 *   the Error if any.
 */
const evaluateRule = (
  rule: string,
  programData: Program,
  questionnaireData: QuestionnaireData,
  currentDate: string
): Result<boolean | undefined, Error> => {
  const rules = programData.publicodes

  const engineResult = initializePublicodesEngine(rules as object)
  if (engineResult.isErr) {
    return Result.err(engineResult.error)
  }

  const engine = engineResult.value

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

export const publicodesService = {
  evaluate: evaluateRule
}

const initializePublicodesEngine = (rules: object): Result<Engine, Error> => {
  let engine: Engine
  try {
    engine = new Engine(rules)
  } catch (e) {
    const err = ensureError(e)
    return Result.err(err)
  }

  return Result.ok(engine)
}

/** Narrows input data to keep only keys expected inside the rules
 */
const narrowInput = (data: PublicodesInputData, engine: Engine): Partial<PublicodesInputData> => {
  const parsedRules = engine.getParsedRules()

  const allowed = Object.keys(parsedRules)

  return filterObject(data, (entry) => allowed.includes(entry[0]))
}
