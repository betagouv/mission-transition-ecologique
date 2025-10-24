import { Establishment } from '../../src/establishment/domain/types'
import { ContactDetails, Opportunity, OpportunityDetails, OpportunityType, ThemeId } from '@tee/common'

export const fakeContact = (): ContactDetails => {
  return {
    lastName: 'name',
    firstName: 'forname',
    email: 'test@email.com',
    phoneNumber: '0605040302',
    companySiret: '83014132100034'
  }
}

export const fakeOpportunityDetails = (): OpportunityDetails => {
  return {
    type: OpportunityType.Program,
    id: 'accelerateur-decarbonation',
    message: 'Bonjour monde !',
    linkToPage: 'https://localhost',
    linkToCatalog: 'https://localhost',
    theme: ThemeId.Building
  }
}

export const fakeOpportunity = (): Opportunity => {
  return {
    ...fakeContact(),
    ...fakeOpportunityDetails()
  }
}

export const fakeEstablishment: Establishment = {
  address: {
    cityCode: '94120',
    cityLabel: 'FONTENAY-SOUS-BOIS',
    streetLabel: '116 RUE DALAYRAC',
    streetNumber: '116',
    streetType: 'RUE',
    zipCode: '94120'
  },
  creationDate: '1991-01-01',
  denomination: 'multi',
  legalCategory: '5510',
  nafCode: '53.10Z',
  nic: '830141321',
  siren: '830141321',
  siret: '83014132100034',
  workforceRange: '41'
}
