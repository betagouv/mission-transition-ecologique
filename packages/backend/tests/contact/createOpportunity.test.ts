import { Maybe, Result } from 'true-myth'
import { ContactDetails, ContactId, OpportunityId, OpportunityDetails, OpportunityUpdateAttributes } from '../../src/contact/domain/types'
import ContactFeatures from '../../src/contact/domain/contactFeatures'
import { expectToBeErr, expectToBeOk } from '../testing'
import { fakeOpportunity } from './testing'

let addContactCalled: boolean
let addOpportunityCalled: boolean

beforeEach(() => {
  addContactCalled = false
  addOpportunityCalled = false
})

const dummyAddContact = (_contact: ContactDetails, _optIn: true): Promise<Result<ContactId, Error>> => {
  addContactCalled = true
  return Promise.resolve(Result.ok({ id: 1 }))
}
const dummyAddOpportunity = (_contactId: number, _opportunitiy: OpportunityDetails): Promise<Result<OpportunityId, Error>> => {
  addOpportunityCalled = true
  return Promise.resolve(Result.ok({ id: '1' }))
}

const dummyUpdateOpportunity = (_opportunitiyId: OpportunityId, _opportunitiy: OpportunityUpdateAttributes): Promise<Maybe<Error>> => {
  return Promise.resolve(Maybe.nothing<Error>())
}

describe(`
   WHEN creating a new opportunity
 EXPECT a contact to be created or updated, and an opportunity to be created`, () => {
  const createOpportunity = new ContactFeatures(
    { createOrUpdate: dummyAddContact },
    { create: dummyAddOpportunity, update: dummyUpdateOpportunity }
  ).createOpportunity

  test('createOpportunity creates or updates a contact and creates an opportunity', async () => {
    const result = await createOpportunity(fakeOpportunity(), true)
    expect(addContactCalled).toBe(true)
    expect(addOpportunityCalled).toBe(true)
    expectToBeOk(result)
  })
})

describe(`
  WHEN creating a new opportunity
   AND contact creation/update or opportunity creation goes wrong
EXPECT createOpportunity to return an error (wrapped in Result)`, () => {
  class ContactError extends Error {}
  class OpportunityError extends Error {}
  const addContactWithError = (_contact: ContactDetails, _optIn: true): Promise<Result<ContactId, Error>> => {
    return Promise.resolve(Result.err(new ContactError('contact error')))
  }

  const addOpportunityWithError = (_contactId: number, _opportunitiy: OpportunityDetails): Promise<Result<OpportunityId, Error>> => {
    return Promise.resolve(Result.err(new OpportunityError('opportunity error')))
  }

  test('createOpportunity escalates contact creation/update error', async () => {
    const createOpportunity = new ContactFeatures(
      {
        createOrUpdate: addContactWithError
      },
      { create: dummyAddOpportunity, update: dummyUpdateOpportunity }
    ).createOpportunity

    const result = await createOpportunity(fakeOpportunity(), true)

    expectToBeErr(result)
    expect(result.error).toBeInstanceOf(ContactError)
  })

  test('createOpportunity escalates opportunity creation error', async () => {
    const createOpportunity = new ContactFeatures(
      {
        createOrUpdate: dummyAddContact
      },
      { create: addOpportunityWithError, update: dummyUpdateOpportunity }
    ).createOpportunity

    const result = await createOpportunity(fakeOpportunity(), true)

    expectToBeErr(result)
    expect(result.error).toBeInstanceOf(OpportunityError)
  })
})
