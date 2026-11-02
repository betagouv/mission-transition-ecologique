import { OpportunityHubTransmissionStatus } from '../../../../../src/opportunity/domain/types'
import { convertDomainToBrevoDealUpdate } from '../../../../../src/opportunity/infrastructure/api/brevo/brevoDeal'

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
