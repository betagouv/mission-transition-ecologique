import type { ProgramData } from '@tee/web/src/types/programTypes'

import Engine from 'publicodes'
import type { PublicodesExpression } from 'publicodes'

import { Result } from 'true-myth'
import { ensureError } from '../helpers/errors'

/** Expected rule to evaluate if a program should be displayed to the user or
 * filtered out (in a program's `publicodes`
 * property).
 *  @constant
 *  @default
 */
export const FILTERING_RULE_NAME: string = 'afficher le dispositif si'

type Name = string
type InputData = Partial<Record<Name, PublicodesExpression>>

/** Filter out programs for which the company is not eligible
 *
 * @param programs - A list of programs, holding data on their eligibility
 *   rules (`publicodes` property)
 * @param inputData - Data associated with the company or the user inputs. The
 *   data is expected to be using the exact same names as the variables in the
 *   rules.
 *
 * @returns Programs from `programs` that are either eligible (rules evaluate
 *   to `true`) or which eligibility cannot be assessed (rules evaluate to
 *   `undefined`, for instance with missing data)
 */
export const filterPrograms = (
  programs: ProgramData[],
  inputData: InputData
): Result<ProgramData[], Error> => {
  console.log(inputData)
  const eligibilityResults = programs.map((p) => evaluateRule(p.publicodes, inputData))

  for (const e of eligibilityResults) {
    if (e.isErr) {
      return Result.err(e.error)
    }
  }

  const filteredPrograms = programs.filter((p) => {
    const e = evaluateRule(p.publicodes, inputData)

    const isPositive = e.isOk && e.value
    const isUndefined = e.isOk && typeof e.value === 'undefined'

    return isPositive || isUndefined
  })

  return Result.ok(filteredPrograms)
}

/** Evaluates given program specific rules and user specific input data, if
 * the program should be displayed to the user.
 *
 * @param rules - An object encoding Publicode rules for a given program. The
 *   constant `FILTERING_RULE_NAME` determines which rule to evaluate, which is therefore
 *   mandatory.
 * @param inputData - Data associated with the company or the user inputs. The
 *   data is expected to be using the exact same names as the variables in the
 *   `rules`.
 *
 * @returns Result that stores the rule evaluation (either a boolean or
 *   `undefined` if the input data does not allow to fully evaluate the rule) or
 *   the Error if any.
 */
const evaluateRule = (rules: any, inputData: InputData): Result<boolean | undefined, Error> => {
  let engine: Engine
  try {
    engine = new Engine(rules)
  } catch (e) {
    const err = ensureError(e)
    return Result.err(err)
  }

  const narrowedData = narrowInput(inputData, engine)
  engine.setSituation(narrowedData)

  const evaluation = engine.evaluate(FILTERING_RULE_NAME)
  const eligibility = evaluation.nodeValue

  if (typeof eligibility !== 'boolean' && typeof eligibility !== 'undefined') {
    return Result.err(
      new Error(`"${FILTERING_RULE_NAME}" is expected to be a boolean or undefined`)
    )
  }
  return Result.ok(eligibility)
}

/** Narrows input data to keep only keys expected inside the rules
 */
const narrowInput = (data: InputData, engine: Engine): Partial<InputData> => {
  const parsedRules = engine.getParsedRules()

  const allowed = Object.keys(parsedRules)

  const filtered = Object.keys(data)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: data[key]
      }
    }, {})

  return filtered
}
