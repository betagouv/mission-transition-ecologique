import { OpportunityHubTransmissionStatus } from '../../../../../src/opportunity/domain/types'
import {
  brevoRepository,
  convertDomainToBrevoDeal,
  convertDomainToBrevoDealUpdate
} from '../../../../../src/opportunity/infrastructure/api/brevo/brevoDeal'
import BrevoAPI from '../../../../../src/opportunity/infrastructure/api/brevo/brevoAPI'
import Monitor from '../../../../../src/common/domain/monitoring/monitor'
import { Result } from 'true-myth'
import { expectToBeErr } from '../../../../testing'
import { fakeOpportunity } from '../../../opportunity.fixtures'
import { OpportunityAssociatedData } from '../../../../../src/opportunity/domain/opportunityAssociatedData'
import { OpportunityType } from '@tee/common'
import { ProgramType } from '@tee/data'

describe('convertDomainToBrevoDealUpdate', () => {
  test('a sent opportunity uses the "envoye" option key and keeps the former envoy and idce attributes', () => {
    expect(convertDomainToBrevoDealUpdate({ transmissionStatus: OpportunityHubTransmissionStatus.Sent, idCe: 42 })).toEqual({
      transmission_status: 'envoye',
      envoy: true,
      idce: '42'
    })
  })

  test('a limited opportunity uses the "limite" option key only', () => {
    expect(convertDomainToBrevoDealUpdate({ transmissionStatus: OpportunityHubTransmissionStatus.Limited })).toEqual({
      transmission_status: 'limite'
    })
  })

  test('a failed opportunity uses the "erreur" option key only', () => {
    expect(convertDomainToBrevoDealUpdate({ transmissionStatus: OpportunityHubTransmissionStatus.Failed })).toEqual({
      transmission_status: 'erreur'
    })
  })
})

describe('convertDomainToBrevoDeal', () => {
  const programData = (partner?: string) => new OpportunityAssociatedData(OpportunityType.Program, {} as ProgramType, partner)

  test('fills the "partenaire" attribute with the partner of the associated data', () => {
    expect(convertDomainToBrevoDeal(fakeOpportunity(), programData('agir')).partenaire).toBe('agir')
  })

  test('leaves the "partenaire" attribute out for an opportunity sent by the TEE site', () => {
    expect(convertDomainToBrevoDeal(fakeOpportunity(), programData())).not.toHaveProperty('partenaire')
  })

  test('never reads the partner from the opportunity sent by the client', () => {
    const opportunityWithPartner = { ...fakeOpportunity(), partner: 'agir' }

    expect(convertDomainToBrevoDeal(opportunityWithPartner, programData())).not.toHaveProperty('partenaire')
  })
})

describe('brevoRepository errors', () => {
  beforeEach(() => {
    vi.stubEnv('BREVO_API_TOKEN', 'fake-token')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  test('reports a GetDeals error of the daily limit with the partner tags', async () => {
    const monitorError = vi.spyOn(Monitor, 'error').mockReturnValue(Monitor)
    vi.spyOn(BrevoAPI.prototype, 'GetDeals').mockResolvedValue(Result.err(new Error('brevo down')))

    expectToBeErr(await brevoRepository.getDailyOpportunitiesByContactId(1, { partner: 'agir' }))

    expect(monitorError).toHaveBeenCalledWith('Error in brevo GetDeal api call', expect.anything(), { partner: 'agir' })
  })

  test('reports a PatchDeal error with the partner tags', async () => {
    const monitorError = vi.spyOn(Monitor, 'error').mockReturnValue(Monitor)
    vi.spyOn(BrevoAPI.prototype, 'PatchDeal').mockResolvedValue(Result.err(new Error('brevo down')))

    const error = await brevoRepository.update(
      { id: '1' },
      { transmissionStatus: OpportunityHubTransmissionStatus.Failed },
      { partner: 'agir' }
    )

    expect(error.isJust).toBe(true)
    expect(monitorError).toHaveBeenCalledWith('Error in Brevo PatchDeal api call', expect.anything(), { partner: 'agir' })
  })
})
