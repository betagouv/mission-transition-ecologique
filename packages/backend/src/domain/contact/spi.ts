import { Result } from 'true-myth'
import { ContactId } from './types'

export type ContactInfoRepository = {
  add: (email: string, attributes: object) => Promise<Result<ContactId, Error>>
}
