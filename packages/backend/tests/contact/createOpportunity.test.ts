import { Result } from 'true-myth'
import { ContactDetails, ContactId, DealId, OpportunityDetails } from '../../src/contact/domain/types'
import { createService } from '../../src/contact/domain/contactFeatures'
import { expectToBeErr, expectToBeOk } from '../testing'
import { fakeOpportunity } from './testing'

let addContactCalled: boolean
let addOpportunityCalled: boolean

beforeEach(() => {
  addContactCalled = false
  addOpportunityCalled = false
})

const dummyAddContact = async (_contact: ContactDetails, _optIn: true): Promise<Result<ContactId, Error>> => {
  addContactCalled = true
  return Result.ok({ id: 1 })
}
const dummyAddOpportunity = async (_contactId: number, _opportunitiy: OpportunityDetails): Promise<Result<DealId, Error>> => {
  addOpportunityCalled = true
  return Result.ok({ id: '1' })
}

describe(`
   WHEN creating a new opportunity
 EXPECT a contact to be created or updated, and an opportunity to be created`, () => {
  const postNewOpportunity = createService({
    addContact: dummyAddContact,
    addOpportunity: dummyAddOpportunity
  }).postNewOpportunity

  test('postNewOpportunity creates or updates a contact and creates an opportunity', async () => {
    const result = await postNewOpportunity(fakeOpportunity(), true)
    expect(addContactCalled).toBe(true)
    expect(addOpportunityCalled).toBe(true)
    expectToBeOk(result)
  })
})

describe(`
  WHEN creating a new opportunity
   AND contact creation/update or opportunity creation goes wrong
EXPECT postNewOpportunity to return an error (wrapped in Result)`, () => {
  class ContactError extends Error {}
  class OpportunityError extends Error {}
  const addContactWithError = async (_contact: ContactDetails, _optIn: true): Promise<Result<ContactId, Error>> => {
    return Result.err(new ContactError('contact error'))
  }

  const addOpportunityWithError = async (_contactId: number, _opportunitiy: OpportunityDetails): Promise<Result<DealId, Error>> => {
    return Result.err(new OpportunityError('opportunity error'))
  }

  test('postNewOpportunity escalates contact creation/update error', async () => {
    const postNewOpportunity = createService({
      addContact: addContactWithError,
      addOpportunity: dummyAddOpportunity
    }).postNewOpportunity

    const result = await postNewOpportunity(fakeOpportunity(), true)

    expectToBeErr(result)
    expect(result.error).toBeInstanceOf(ContactError)
  })

  test('postNewOpportunity escalates opportunity creation error', async () => {
    const postNewOpportunity = createService({
      addContact: dummyAddContact,
      addOpportunity: addOpportunityWithError
    }).postNewOpportunity

    const result = await postNewOpportunity(fakeOpportunity(), true)

    expectToBeErr(result)
    expect(result.error).toBeInstanceOf(OpportunityError)
  })
})
