import type { ConditionTrack, NextTrackRule } from '@/types'
import { ConditionOperators } from '@/types'

export const CheckConditions = (data: any, conditions: ConditionTrack[]) => {
  return conditions.every((cond) => evaluateCondition(cond, data))
}

const evaluateCondition = (condition: ConditionTrack, data: any): boolean => {
  const dataKey: string | undefined = condition.type

  switch (condition.operator) {
    case ConditionOperators.exists:
      // actually exists and is truthy
      const exists = !!dataKey && dataKey in data
      const isTruthy = exists && data[dataKey]
      return exists && isTruthy

    case ConditionOperators.missing:
      // actually is missing or is falsy
      const isMissing = !!dataKey && dataKey! in data
      const isFalsy = !!dataKey && dataKey in data && !data[dataKey]
      return isMissing || isFalsy

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
