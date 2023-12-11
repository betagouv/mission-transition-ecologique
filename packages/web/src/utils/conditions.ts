import type { Condition, NextTrackRule } from '@/types'
import { ConditionOperators } from '@/types'

export const checkConditions = (conditions: Condition[], data: any) => {
  return conditions.every((cond) => checkCondition(cond, data))
}

const checkCondition = (condition: Condition, data: any): boolean => {
  const dataKey: string = condition.type

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
      return data[dataKey] === condition.value
  }
}

export const CheckNextTrackRules = (data: any, rules: NextTrackRule[]) => {
  // console.log()
  // console.log('utils > conditions > CheckNextTrackRules > data :', data)
  // console.log('...')
  const boolArray = [true]

  rules.forEach((rule: NextTrackRule) => {
    // console.log('utils > conditions > CheckNextTrackRules > rule :', rule)
    const bool = checkConditions(rule.conditions, data)
    boolArray.push(bool)
  })

  return boolArray.every((b) => !!b)
}
