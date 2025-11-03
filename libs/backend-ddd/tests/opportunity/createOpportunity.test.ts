import { NAF1 } from '@tee/common'
import { Maybe, Result } from 'true-myth'
import EstablishmentFeatures from '../../src/establishment/domain/establishmentFeatures'
import { CityToRegionMappingType, EstablishmentRepository, NafRepository } from '../../src/establishment/domain/spi'
import { MailerManager } from '../../src/opportunity/domain/spi'
import OpportunityFeatures from '../../src/opportunity/domain/opportunityFeatures'
import OpportunityHubFeatures from '../../src/opportunityHub/domain/opportunityHubFeatures'
import ProgramFeatures from '../../src/program/domain/programFeatures'
import ProjectFeatures from '../../src/project/domain/projectFeatures'
import { ProjectEligibilityInterface, ProjectRepository, ProjectSorterInterface } from '../../src/project/domain/spi'
import {
  PlaceDesEntreprisesMock,
  PlaceDesEntreprisesMockWithReturnReceipt
} from '../opportunityHub/infrastructure/api/mock/placeDesEntreprises.mock'
import { expectToBeErr, expectToBeOk } from '../testing'
import { fakeOpportunity, fakeEstablishment } from './opportunity.fixtures'
import type { ContactRepository, OpportunityRepository } from '../../src/opportunity/domain/spi'
import { ProgramRepository } from '../../src/program/domain/spi'
import { ProgramType, ProjectType } from '@tee/data'
import { ContactId, OpportunityDetailsShort, OpportunityId, SearchResult } from '../../src/index'

let addContactCalled: boolean
let addOpportunityCalled: boolean
let emailReceiptSent: boolean

beforeEach(() => {
  addContactCalled = false
  addOpportunityCalled = false
  emailReceiptSent = false
})

const dummyAddContact = (): Promise<Result<ContactId, Error>> => {
  addContactCalled = true
  return Promise.resolve(Result.ok({ id: 1 }))
}

const dummyMailRepository: MailerManager = {
  sendReturnReceipt: async () => {
    emailReceiptSent = true
    return Promise.resolve(void 0)
  }
}

const dummyContactRepository: ContactRepository = { createOrUpdate: dummyAddContact }

const dummyAddOpportunity = (): Promise<Result<OpportunityId, Error>> => {
  addOpportunityCalled = true
  return Promise.resolve(Result.ok({ id: '1' }))
}

const dummyUpdateOpportunity = (): Promise<Maybe<Error>> => {
  return Promise.resolve(Maybe.nothing<Error>())
}

const dummyOpportunitiesDates = (): Promise<Result<Date[], Error>> => {
  return Promise.resolve(Result.ok([new Date(2024, 0, 1)]))
}

const dummyDailyOpportunities = (): Promise<Result<OpportunityDetailsShort[], Error>> => {
  return Promise.resolve(Result.ok([]))
}

const dummyDailyOpportunitiesWithLimitReached = (): Promise<Result<OpportunityDetailsShort[], Error>> => {
  return Promise.resolve(Result.ok([{} as OpportunityDetailsShort, {} as OpportunityDetailsShort]))
}

const dummyOpportunityRepository: OpportunityRepository = {
  create: dummyAddOpportunity,
  update: dummyUpdateOpportunity,
  readDates: dummyOpportunitiesDates,
  getDailyOpportunitiesByContactId: dummyDailyOpportunities
}

const dummyOpportunityRepositoryWithLimitReached: OpportunityRepository = {
  ...dummyOpportunityRepository,
  getDailyOpportunitiesByContactId: dummyDailyOpportunitiesWithLimitReached
}

const dummyProgramRepository: ProgramRepository = {
  getAll: () => [],
  getEditablePrograms: () => [],
  getById: () => ({}) as ProgramType
}

const dummyProjectRepository: ProjectRepository = {
  getOneBySlug: () => ({}) as ProjectType | undefined,
  getOneById: () => ({}) as ProjectType | undefined,
  get: () => []
}

const dummyProjectEligibility: ProjectEligibilityInterface = {
  isEligible: () => true
}

const dummyProjectSorter: ProjectSorterInterface = {
  byPriority: (projects: ProjectType[]) => projects
}

const dummyEstablishmentRepository: EstablishmentRepository = {
  get: () => Promise.resolve(Result.ok(fakeEstablishment)),
  search: () => Promise.resolve(Result.ok({ establishments: [fakeEstablishment], resultCount: 1 } as SearchResult))
}

const cityToRegionMappingMock: CityToRegionMappingType = {
  getRegion: (): Maybe<string> => {
    return Maybe.of('Île-de-France')
  }
}

const nafRepositoryMock: NafRepository = {
  getLabel: () => Maybe.of('Some Label'),
  getSectionCode: () => Maybe.of('J'),
  searchNAF: () => Result.ok([{ codeNAF: '62.01Z', secteur: 'Programmation informatique', codeNAF1: NAF1.J }])
}

const programFeaturesMock: ProgramFeatures = new ProgramFeatures(dummyProgramRepository)
const projectFeaturesMock: ProjectFeatures = new ProjectFeatures(dummyProjectRepository, dummyProjectEligibility, dummyProjectSorter)
const opportunityHubFeaturesMock: OpportunityHubFeatures = new OpportunityHubFeatures([new PlaceDesEntreprisesMock()])
const establishmentFeaturesMock: EstablishmentFeatures = new EstablishmentFeatures(
  dummyEstablishmentRepository,
  cityToRegionMappingMock,
  nafRepositoryMock
)

const makeCreateOpportunity = (
  contactRepository: ContactRepository,
  opportunityRepository: OpportunityRepository,
  _opportunityHubFeaturesMock = opportunityHubFeaturesMock
) => {
  return new OpportunityFeatures(
    contactRepository,
    opportunityRepository,
    dummyMailRepository,
    _opportunityHubFeaturesMock,
    programFeaturesMock,
    projectFeaturesMock,
    establishmentFeaturesMock
  ).createOpportunity
}

describe(`
   WHEN creating a new opportunity
 EXPECT a contact to be created or updated, and an opportunity to be created and emailReceipt sent`, () => {
  const createOpportunity = makeCreateOpportunity(
    dummyContactRepository,
    dummyOpportunityRepositoryWithLimitReached,
    new OpportunityHubFeatures([new PlaceDesEntreprisesMockWithReturnReceipt()])
  )

  test('createOpportunity creates or updates a contact and creates an opportunity', async () => {
    const result = await createOpportunity(fakeOpportunity(), true)
    expect(addContactCalled).toBe(true)
    expect(addOpportunityCalled).toBe(true)

    // Wait for emailReceipt to be sent asynchronously
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(emailReceiptSent).toBe(true)
    expectToBeOk(result)
  })
})

describe(`
  WHEN creating a new opportunity
   AND contact creation/update or opportunity creation goes wrong
EXPECT createOpportunity to return an error (wrapped in Result) and emailReceipt not sent`, () => {
  // define test repositories that throw errors
  class ContactError extends Error {}
  class OpportunityError extends Error {}
  const addContactWithError = (): Promise<Result<ContactId, Error>> => {
    return Promise.resolve(Result.err(new ContactError('contact error')))
  }

  const errorContactRepository = { createOrUpdate: addContactWithError }

  const addOpportunityWithError = (): Promise<Result<OpportunityId, Error>> => {
    return Promise.resolve(Result.err(new OpportunityError('opportunity error')))
  }

  const errorOpportunityRepository = {
    create: addOpportunityWithError,
    update: dummyUpdateOpportunity,
    readDates: dummyOpportunitiesDates,
    getDailyOpportunitiesByContactId: dummyDailyOpportunities
  }

  test('createOpportunity escalates contact creation/update error', async () => {
    const createOpportunity = makeCreateOpportunity(errorContactRepository, dummyOpportunityRepository)

    const result = await createOpportunity(fakeOpportunity(), true)

    expectToBeErr(result)
    expect(result.error).toBeInstanceOf(ContactError)
    expect(emailReceiptSent).toBe(false)
  })

  test('createOpportunity escalates opportunity creation error', async () => {
    const createOpportunity = makeCreateOpportunity(dummyContactRepository, errorOpportunityRepository)

    const result = await createOpportunity(fakeOpportunity(), true)

    expectToBeErr(result)
    expect(result.error).toBeInstanceOf(OpportunityError)
    expect(emailReceiptSent).toBe(false)
  })
})
