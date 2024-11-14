import { Result } from 'true-myth'
import { ContactId } from '../../../../domain/types'
import { ContactRepository } from '../../../../domain/spi'

export const addBrevoContactTest: ContactRepository['createOrUpdate'] = async () => {
  return Result.ok(0 as unknown as ContactId) as Result<ContactId, Error>
}
