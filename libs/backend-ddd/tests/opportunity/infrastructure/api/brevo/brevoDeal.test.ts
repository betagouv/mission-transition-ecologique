import { OpportunityHubTransmissionStatus } from '../../../../../src/opportunity/domain/types'
import { convertDomainToBrevoDeal, convertDomainToBrevoDealUpdate } from '../../../../../src/opportunity/infrastructure/api/brevo/brevoDeal'
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
