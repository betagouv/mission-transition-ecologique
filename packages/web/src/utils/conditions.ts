import type { ConditionTrack, NextTrackRule } from '@/types'
import { ConditionOperators } from '@/types'

export const CheckConditions = (data: any, conditions: ConditionTrack[], strict: boolean = false) => {
  // console.log()
  // console.log('utils > conditions > CheckConditions > data :', data)
  // console.log('...')
  // console.log('utils > conditions > CheckConditions > rules :', rules)
  const boolArray = [true]

  conditions.forEach((condition: ConditionTrack) => {
    // console.log('utils > conditions > CheckConditions > condition :', condition)
    const condOperator = condition.operator
    // console.log('utils > conditions > CheckConditions > condOperator :', condOperator)
    const condField: string = condition.type || ''
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const dataValue = data[condField]
    // console.log('utils > conditions > CheckConditions > dataValue :', dataValue)
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
    // console.log('utils > conditions > CheckConditions > condBool :', condBool)
    boolArray.push(condBool)
  })

  return boolArray.every((b) => !!b)
}

export const CheckNextTrackRules = (data: any, rules: NextTrackRule[]) => {
  // console.log()
  // console.log('utils > conditions > CheckNextTrackRules > data :', data)
  // console.log('...')
  const boolArray = [true]

  rules.forEach((rule: NextTrackRule) => {
    // console.log('utils > conditions > CheckNextTrackRules > rule :', rule)
    const bool = CheckConditions(data, rule.conditions, true)
    boolArray.push(bool)
  })

  return boolArray.every((b) => !!b)
}
