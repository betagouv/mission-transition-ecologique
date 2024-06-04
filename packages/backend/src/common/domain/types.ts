import { ContactId as contactIdFromContactDomain } from '../../opportunity/domain/types'
import { ContactId as contactIdFromopportunityHubDomain } from '../../opportunityHub/domain/types'
export type ContactId = contactIdFromContactDomain | contactIdFromopportunityHubDomain
// export { Objective } from '../../../common/src/questionnaire/types'
export * from '@tee/common/src/questionnaire/types'
