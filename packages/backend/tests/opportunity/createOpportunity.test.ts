import { Maybe, Result } from 'true-myth'
import {
  ContactDetails,
  ContactId,
  OpportunityId,
  OpportunityDetails,
  OpportunityUpdateAttributes
} from '../../src/opportunity/domain/types'
import OpportunityFeatures from '../../src/opportunity/domain/opportunityFeatures'
import { expectToBeErr, expectToBeOk } from '../testing'
import { fakeOpportunity } from './testing'
import type { ContactRepository, OpportunityRepository } from '../../src/opportunity/domain/spi'
import { ProgramRepository } from '../../src/program/domain/spi'

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

const dummyContactRepository: ContactRepository = { createOrUpdate: dummyAddContact }

const dummyAddOpportunity = (_contactId: number, _opportunitiy: OpportunityDetails): Promise<Result<OpportunityId, Error>> => {
  addOpportunityCalled = true
  return Promise.resolve(Result.ok({ id: '1' }))
}

const dummyUpdateOpportunity = (_opportunitiyId: OpportunityId, _opportunitiy: OpportunityUpdateAttributes): Promise<Maybe<Error>> => {
  return Promise.resolve(Maybe.nothing<Error>())
}

const dummyOpportunityRepository: OpportunityRepository = { create: dummyAddOpportunity, update: dummyUpdateOpportunity }

const makeCreateOpportunityFun = (contactRepository: ContactRepository, opportunityRepository: OpportunityRepository) => {
  return new OpportunityFeatures(contactRepository, opportunityRepository, [], dummyProgramRepository).createOpportunity
}

const dummyProgramRepository: ProgramRepository = {
  getAll: () => [],
  getById: (_id: string) => undefined
}

describe(`
   WHEN creating a new opportunity
 EXPECT a contact to be created or updated, and an opportunity to be created`, () => {
  const createOpportunity = makeCreateOpportunityFun(dummyContactRepository, dummyOpportunityRepository)

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
  // define test repositories that throw errors
  class ContactError extends Error {}
  class OpportunityError extends Error {}
  const addContactWithError = (_contact: ContactDetails, _optIn: true): Promise<Result<ContactId, Error>> => {
    return Promise.resolve(Result.err(new ContactError('contact error')))
  }

  const errorContactRepository = { createOrUpdate: addContactWithError }

  const addOpportunityWithError = (_contactId: number, _opportunitiy: OpportunityDetails): Promise<Result<OpportunityId, Error>> => {
    return Promise.resolve(Result.err(new OpportunityError('opportunity error')))
  }

  const errorOpportunityRepository = { create: addOpportunityWithError, update: dummyUpdateOpportunity }

  test('createOpportunity escalates contact creation/update error', async () => {
    const createOpportunity = makeCreateOpportunityFun(errorContactRepository, dummyOpportunityRepository)

    const result = await createOpportunity(fakeOpportunity(), true)

    expectToBeErr(result)
    expect(result.error).toBeInstanceOf(ContactError)
  })

  test('createOpportunity escalates opportunity creation error', async () => {
    const createOpportunity = makeCreateOpportunityFun(dummyContactRepository, errorOpportunityRepository)

    const result = await createOpportunity(fakeOpportunity(), true)

    expectToBeErr(result)
    expect(result.error).toBeInstanceOf(OpportunityError)
  })
})
