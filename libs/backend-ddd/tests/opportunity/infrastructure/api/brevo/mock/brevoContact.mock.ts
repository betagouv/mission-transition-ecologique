import { Result } from 'true-myth'
import { ContactId } from '../../../../../../src/opportunity/domain/types'
import { ContactRepository } from '../../../../../../src/opportunity/domain/spi'

export const addBrevoContactMock: ContactRepository['createOrUpdate'] = async () => {
  return Result.ok(0 as unknown as ContactId) as Result<ContactId, Error>
}
