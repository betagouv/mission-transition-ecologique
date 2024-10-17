import { OperatorFilter } from './generatedShared'
import { Operators } from '../../generated/program'

export interface EnrichedOperator {
  operator: Operators
  filterCategories: OperatorFilter[]
}
