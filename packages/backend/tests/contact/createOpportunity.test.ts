import { Result } from 'true-myth'
import type { ContactInfoRepository } from '../../src/contact/domain/spi'
import { ContactId, DealId } from '../../src/contact/domain/types'
import { createService } from '../../src/contact/domain/contactFeatures'
import { expectToBeErr, expectToBeOk } from '../testing'

describe(`
   WHEN creating a new opportunity
 EXPECT a contact to be created or updated, and an opportunity to be created`, () => {
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
    const result = await postNewOpportunity('test@email.com', {})
    expect(contactCreated).toBe(true)
    expectToBeOk(result)
  })

  test('postNewOpportunity creates an opportunity', async () => {
    const result = await postNewOpportunity('test@email.com', {})
    expect(opportunityCreated).toBe(true)
    expectToBeOk(result)
  })
})

describe(`
  WHEN creating a new opportunity
   AND contact creation/update or opportunity creation goes wrong
EXPECT postNewOpportunity to return an error (wrapped in Result)`, () => {
  const testRepository: ContactInfoRepository = {
    addContact: async (_email: string, _attributes: object): Promise<Result<ContactId, Error>> => {
      return Result.err(new Error('contact error'))
    },
    addOpportunity: async (_contactId: number, _attributes: object): Promise<Result<DealId, Error>> => {
      return Result.err(new Error('opportunity error'))
    }
  }

  const postNewOpportunity = createService(testRepository).postNewOpportunity

  test('postNewOpportunity escalates contact creation/update error', async () => {
    const result = await postNewOpportunity('test@email.com', {})
    expectToBeErr(result)
  })
})
