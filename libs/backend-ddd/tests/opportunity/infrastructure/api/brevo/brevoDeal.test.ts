import { OpportunityHubTransmissionStatus } from '../../../../../src/opportunity/domain/types'
import { convertDomainToBrevoDeal, convertDomainToBrevoDealUpdate } from '../../../../../src/opportunity/infrastructure/api/brevo/brevoDeal'
import { fakeOpportunity } from '../../../opportunity.fixtures'

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
  test('fills the "partenaire" attribute with the partner of the API key', () => {
    expect(convertDomainToBrevoDeal({ ...fakeOpportunity(), partner: 'agir' }).partenaire).toBe('agir')
  })

  test('leaves the "partenaire" attribute out for an opportunity sent by the TEE site', () => {
    expect(convertDomainToBrevoDeal(fakeOpportunity())).not.toHaveProperty('partenaire')
  })
})
