import { Result } from 'true-myth'
import { ContactId, ContactInfoBodyAttributes, ContactUpdateAttributes } from './types'

export type ContactInfoRepository = {
  create: (email: string, attributes: ContactInfoBodyAttributes) => Promise<Result<ContactId, Error>>
  update: (contactId: ContactId, attributes: ContactUpdateAttributes) => Promise<Result<ContactId, Error>>
}
