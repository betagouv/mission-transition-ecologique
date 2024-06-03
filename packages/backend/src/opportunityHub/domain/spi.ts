import { Operators, Program } from '../../program/domain/types/types'
import { Opportunity, OpportunityWithContactId } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'

export interface OpportunityHubRepository {
  get operatorNames(): Operators[] | Error
  transmitOpportunity: (opportunity: Opportunity, program: Program) => Promise<Maybe<Error>>
  support: (program: Program) => boolean
  shouldTransmit: (opportunity: OpportunityWithContactId, program: Program) => Promise<boolean>
}
