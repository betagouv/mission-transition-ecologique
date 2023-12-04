import type { ConditionTrack, NextTrackRule } from '@/types'
import { ConditionOperators } from '@/types'

export const CheckConditions = (data: any, conditions: ConditionTrack[]) => {
  const boolArray = conditions.map((cond) => evaluateCondition(cond, data))

  return boolArray.every((b) => !!b)
}

const evaluateCondition = (condition: ConditionTrack, data: any): boolean => {
  const dataKey: string | undefined = condition.type

  switch (condition.operator) {
    case ConditionOperators.exists:
      return !!dataKey && dataKey in data

    case ConditionOperators.missing:
      return !!dataKey && dataKey! in data

    case ConditionOperators.is:
      return !!dataKey && data[dataKey] === condition.value
  }

  return false
}

export const CheckNextTrackRules = (data: any, rules: NextTrackRule[]) => {
  // console.log()
  // console.log('utils > conditions > CheckNextTrackRules > data :', data)
  // console.log('...')
  const boolArray = [true]

  rules.forEach((rule: NextTrackRule) => {
    // console.log('utils > conditions > CheckNextTrackRules > rule :', rule)
    const bool = CheckConditions(data, rule.conditions)
    boolArray.push(bool)
  })

  return boolArray.every((b) => !!b)
}
