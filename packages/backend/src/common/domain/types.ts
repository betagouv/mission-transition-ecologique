import { ContactId as contactIdFromContactDomain } from '../../opportunity/domain/types'
import { ContactId as contactIdFromOperatorDomain } from '../../operator/domain/types'
export type ContactId = contactIdFromContactDomain | contactIdFromOperatorDomain
