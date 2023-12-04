import type { ConditionTrack, NextTrackRule } from '@/types'
import { ConditionOperators } from '@/types'

export const CheckConditions = (conditions: ConditionTrack[], data: any) => {
  return conditions.every((cond) => checkCondition(cond, data))
}

const checkCondition = (condition: ConditionTrack, data: any): boolean => {
  const dataKey: string | undefined = condition.type

  if (!dataKey) return false

  switch (condition.operator) {
    case ConditionOperators.exists:
      // actually exists and is truthy
      const exists = dataKey in data
      const isTruthy = exists && data[dataKey]
      return exists && isTruthy

    case ConditionOperators.isMissing:
      // actually is missing or is falsy
      const isMissing = !(dataKey in data)
      const isFalsy = dataKey in data && !data[dataKey]
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
    const bool = CheckConditions(rule.conditions, data)
    boolArray.push(bool)
  })

  return boolArray.every((b) => !!b)
}
