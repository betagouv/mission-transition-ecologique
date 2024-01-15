import { ContactId as contactIdFromContactDomain } from '../../contact/domain/types'
import { ContactId as contactIdFromOperatorDomain } from '../../operator/domain/types'
export type ContactId = contactIdFromContactDomain | contactIdFromOperatorDomain
