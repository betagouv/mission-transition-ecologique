import { OpportunityWithContactId } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'
import { Operators, Program } from '@tee/data'
import { Opportunity } from '@tee/common'

export interface OpportunityHubRepository {
  get operatorNames(): Operators[] | Error
  transmitOpportunity: (opportunity: Opportunity, program: Program) => Promise<Maybe<Error>>
  support: (program: Program) => boolean
  shouldTransmit: (opportunity: OpportunityWithContactId, program: Program) => Promise<boolean>
}
