import { Result } from 'true-myth'
import { Operators } from '@tee/data'
import { Opportunity } from '@tee/common'
import { OpportunityAssociatedData } from '../../opportunity/domain/opportunityAssociatedData'

export interface OpportunityHubRepository {
  get operatorNames(): Operators[] | Error
  transmitOpportunity: (opportunity: Opportunity, opportunityObject: OpportunityAssociatedData) => Promise<Result<number, Error>>
  support: (opportunityObject: OpportunityAssociatedData) => boolean
  needReturnReceipt: () => boolean
  hasTransmissionLimit(): boolean
}
