import { OpportunityWithContactId } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'
import { Operators, ProgramTypeWithPublicode } from '@tee/data'
import { Opportunity } from '@tee/common'

export interface OpportunityHubRepository {
  get operatorNames(): Operators[] | Error
  transmitOpportunity: (opportunity: Opportunity, program: ProgramTypeWithPublicode) => Promise<Maybe<Error>>
  support: (program: ProgramTypeWithPublicode) => boolean
  shouldTransmit: (opportunity: OpportunityWithContactId, program: ProgramTypeWithPublicode) => Promise<boolean>
}
