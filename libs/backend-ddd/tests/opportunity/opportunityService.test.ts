import { Result } from 'true-myth'
import { OpportunityType } from '@tee/common'
import OpportunityService from '../../src/opportunity/application/opportunityService'
import Config from '../../src/config'
import EstablishmentFeatures from '../../src/establishment/domain/establishmentFeatures'
import { OpportunityAssociatedData } from '../../src/opportunity/domain/opportunityAssociatedData'
import { OpportunityWithOperatorContactAndContactId } from '../../src/opportunity/domain/types'
import { convertDomainToBrevoDeal } from '../../src/opportunity/infrastructure/api/brevo/brevoDeal'
import { brevoRepositoryMock } from './infrastructure/api/brevo/mock/brevoDeal.mock'
import { expectToBeOk } from '../testing'
import { fakeOpportunity } from './opportunity.fixtures'

describe(`
   WHEN the service creates an opportunity with the partner of an API key
 EXPECT the partner to reach the Brevo deal`, () => {
  beforeEach(() => {
    // Mock repositories (Brevo, Place des Entreprises) and no call to the establishment API
    vi.spyOn(Config, 'BREVO_API_ENABLED', 'get').mockReturnValue(false)
    vi.spyOn(Config, 'PDE_API_ENABLED', 'get').mockReturnValue(false)
    vi.spyOn(EstablishmentFeatures.prototype, 'getBySiret').mockResolvedValue(Result.err(new Error('no establishment API in tests')))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test.each([['agir'], [undefined]])('partner %s', async (partner) => {
    const create = vi.spyOn(brevoRepositoryMock, 'create')

    const result = await new OpportunityService().createOpportunity(
      { ...fakeOpportunity(), type: OpportunityType.CustomProject, titleMessage: 'Mon projet' },
      true,
      partner
    )

    expectToBeOk(result)
    const [createdOpportunity, associatedData] = create.mock.calls[0] as [
      OpportunityWithOperatorContactAndContactId,
      OpportunityAssociatedData
    ]
    expect(associatedData.partner).toBe(partner)
    expect(convertDomainToBrevoDeal(createdOpportunity, associatedData).partenaire).toBe(partner)
  })
})
