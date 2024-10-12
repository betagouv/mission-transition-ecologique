import { OpportunityWithContactId } from '../../opportunity/domain/types'
import { Maybe } from 'true-myth'
import { Operators } from '@tee/data'
import { Opportunity } from '@tee/common'
import { OpportunityObject } from '../../opportunity/domain/opportunityObject'

export interface OpportunityHubRepository {
  get operatorNames(): Operators[] | Error
  transmitOpportunity: (opportunity: Opportunity, opportunityObject: OpportunityObject) => Promise<Maybe<Error>>
  support: (opportunityObject: OpportunityObject) => boolean
  shouldTransmit: (opportunity: OpportunityWithContactId, opportunityObject: OpportunityObject) => Promise<boolean>
}
