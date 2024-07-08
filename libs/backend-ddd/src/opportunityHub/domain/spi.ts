import { OpportunityWithContactId } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'
import { Operators, ProgramType } from '@tee/data'
import { Opportunity } from '@tee/common'

export interface OpportunityHubRepository {
  get operatorNames(): Operators[] | Error
  transmitProgramOpportunity: (opportunity: Opportunity, program: ProgramType) => Promise<Maybe<Error>>
  support: (program: ProgramType) => boolean
  shouldTransmit: (opportunity: OpportunityWithContactId, program: ProgramType) => Promise<boolean>
}
