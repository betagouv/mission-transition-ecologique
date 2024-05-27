import { Operators, Program } from '../../program/domain/types/types'
import { Opportunity } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'

export interface OpportunityHubRepository {
  get operatorNames(): Operators[]
  createOpportunity: (opporunity: Opportunity, program: Program) => Promise<Maybe<Error>>
  support: (program: Program) => boolean
}
