import { Operators, Program } from '../../program/domain/types/types'
import { Opportunity } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'

export interface OpportunityHubRepository {
  get operatorNames(): Operators[] | Error
  transmitOpportunity: (opportunity: Opportunity, program: Program) => Promise<Maybe<Error>>
  support: (program: Program) => boolean
  shouldReceive: (opportunity: Opportunity, program: Program) => Promise<boolean>
}
