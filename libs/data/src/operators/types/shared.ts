import { OperatorFilter } from './generatedShared'
import { Operators } from '../../program/types/program'

export interface EnrichedOperator {
  operator: Operators
  filterCategories: OperatorFilter[]
  imagePath?: string
}
