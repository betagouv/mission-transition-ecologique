// CONSOLE LOG TEMPLATE
// console.log(`utils.conditions > FUNCTION_NAME > MSG_OR_VALUE :`)

import type { ConditionTrack, NextTrackRule } from '@/types'
import { ConditionOperators } from '@/types'

export const CheckConditions = (data: any, conditions: ConditionTrack[], strict: boolean = false) => {
  const boolArray = [true]

  conditions.forEach((condition: ConditionTrack) => {
    const condOperator = condition.operator
    const condField: string = condition.type || ''
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const dataValue = data[condField]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const condVal = condition.value
    let condBool = !strict
    if (dataValue) {
      switch (condOperator) {
        case ConditionOperators.exists:
          condBool = !!dataValue
          break
        case ConditionOperators.inexists:
          condBool = !dataValue
          break
        case ConditionOperators.is:
          condBool = condition.value === dataValue
          break
        case ConditionOperators.or:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
          condBool = (dataValue.includes('*') || condVal.includes('*')) as boolean
          if (!condBool) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return
            const intersection = condVal.filter((v: any) => dataValue.includes(v))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
            condBool = dataValue.includes('*') || intersection.length
          }
          break
      }
    }
    boolArray.push(condBool)
  })

  return boolArray.every((b) => !!b)
}

export const CheckNextTrackRules = (data: any, rules: NextTrackRule[]) => {
  const boolArray = [true]

  rules.forEach((rule: NextTrackRule) => {
    const bool = CheckConditions(data, rule.conditions, true)
    boolArray.push(bool)
  })

  return boolArray.every((b) => !!b)
}
