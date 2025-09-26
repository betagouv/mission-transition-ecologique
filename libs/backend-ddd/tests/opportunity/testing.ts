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
