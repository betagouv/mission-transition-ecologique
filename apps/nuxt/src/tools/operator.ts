import operatorsJson from '@/public/json/operator/operators.json'
import { EnrichedOperator } from '@tee/data'

export const enrichedOperators: EnrichedOperator[] = operatorsJson as unknown as EnrichedOperator[]

export class Operator {
  getFilterItems() {
    return [...new Set(enrichedOperators.flatMap((enrichedOperators) => enrichedOperators.filterCategories))]
      .map((programOperator) => {
        return { label: programOperator, name: programOperator, id: programOperator, value: programOperator, modelValue: [programOperator] }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }

  getOneByName(name: string): EnrichedOperator | undefined {
    return enrichedOperators.find((operator) => operator.operator === name)
  }
}
