import Engine from 'publicodes'
import { Result } from 'true-myth'
import type { PublicodesInputData } from './types'
import { filterObject } from '../../common/objects'
import { preprocessInputForPublicodes } from './preprocessProgramsPublicodes'
import { ProgramType, PublicodesCondition } from '@tee/data'
import { QuestionnaireData, PublicodesKeys, FormattedPublicodesKeys, PublicodeObjective, Objective } from '@tee/common'

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
  programData: ProgramType,
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
const getNoPublicodeKey = (publicodeKey: string): FormattedPublicodesKeys | undefined => {
  switch (publicodeKey) {
    case PublicodesKeys.hasObjective:
      return FormattedPublicodesKeys.hasObjective
    default:
      return undefined
  }
}
type objectivePublicodeData = {
  [key in PublicodesCondition]: PublicodeObjective[]
}
const isObjectivePublicodeData = (data: unknown): data is objectivePublicodeData => {
  return typeof data === 'object' && data !== null && PublicodesCondition.oneOfThese in data
}
const getNoPublicodeObjective = (publicodeData: objectivePublicodeData): Objective[] | null => {
  const publicodeToObjectiveMapping = {
    [PublicodeObjective.EnvironmentalImpact]: Objective.EnvironmentalImpact,
    [PublicodeObjective.EnergyPerformance]: Objective.EnergyPerformance,
    [PublicodeObjective.WaterConsumption]: Objective.WaterConsumption,
    [PublicodeObjective.BuildingRenovation]: Objective.BuildingRenovation,
    [PublicodeObjective.SustainableMobility]: Objective.SustainableMobility,
    [PublicodeObjective.WasteManagement]: Objective.WasteManagement,
    [PublicodeObjective.EcoDesign]: Objective.EcoDesign,
    [PublicodeObjective.TrainOrRecruit]: Objective.TrainOrRecruit,
    [PublicodeObjective.MakeSavings]: Objective.MakeSavings,
    [PublicodeObjective.DurablyInvest]: Objective.DurablyInvest,
    [PublicodeObjective.UnknownYet]: Objective.UnknownYet
  }

  if (publicodeData) {
    const objectives: PublicodeObjective[] = publicodeData[PublicodesCondition.oneOfThese]
    return objectives.map((obj: PublicodeObjective) => publicodeToObjectiveMapping[obj])
  }
  return null
}

const getNoPublicodeData = (publicodeKey: FormattedPublicodesKeys, publicodeData: unknown) => {
  if (publicodeKey === FormattedPublicodesKeys.hasObjective && isObjectivePublicodeData(publicodeData)) {
    const conditions = getNoPublicodeObjective(publicodeData)
    return conditions
  }
  return null
}
/** Narrows input data to keep only keys expected inside the rules
 */
const narrowInput = (data: PublicodesInputData, engine: Engine): Partial<PublicodesInputData> => {
  const parsedRules = engine.getParsedRules()

  const allowed = Object.keys(parsedRules)

  return filterObject(data, (entry) => allowed.includes(entry[0]))
}

export const convertProgramPublicodes = (program: ProgramType) => {
  const publicodes = program.publicodes
  const convertedProgramPublicodes = Object.keys(publicodes).reduce<{ [key in FormattedPublicodesKeys]?: string[] }>(
    (acc, publicodeKey) => {
      const convertedKey: FormattedPublicodesKeys | undefined = getNoPublicodeKey(publicodeKey)
      if (convertedKey) {
        const convertedData = getNoPublicodeData(convertedKey, publicodes[publicodeKey])
        if (convertedData) {
          acc[convertedKey] = convertedData
        }
      }
      return acc
    },
    {}
  )
  return { ...program, publicodes: convertedProgramPublicodes }
}
