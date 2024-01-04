import { Result } from 'true-myth'
import type { ContactInfoRepository } from '../../src/contact/domain/spi'
import { ContactId, DealId } from '../../src/contact/domain/types'
import { createService } from '../../src/contact/domain/contactFeatures'

let contactCreated: boolean
let opportunityCreated: boolean

beforeEach(() => {
  contactCreated = false
  opportunityCreated = false
})

const testRepository: ContactInfoRepository = {
  addContact: async (_email: string, _attributes: object): Promise<Result<ContactId, Error>> => {
    contactCreated = true
    return Result.ok({ id: 1 }) as Result<ContactId, Error>
  },
  addOpportunity: async (_contactId: number, _attributes: object): Promise<Result<DealId, Error>> => {
    opportunityCreated = true
    return Result.ok({ id: '1' }) as Result<DealId, Error>
  }
}

const postNewOpportunity = createService(testRepository).postNewOpportunity

test('postNewOpportunity creates or updates a contact', async () => {
  await postNewOpportunity('test@email.com', {})
  expect(contactCreated).toBe(true)
})

test('postNewOpportunity creates an opportunity', async () => {
  await postNewOpportunity('test@email.com', {})
  expect(opportunityCreated).toBe(true)
})
