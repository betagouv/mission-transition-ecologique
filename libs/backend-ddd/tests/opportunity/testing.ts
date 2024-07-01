import { ContactDetails, Opportunity, OpportunityDetails } from '@tee/common'

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
    programId: 'accelerateur-decarbonation',
    message: 'Bonjour monde !',
    linkToProgramPage: 'https://localhost'
  }
}

export const fakeOpportunity = (): Opportunity => {
  return {
    ...fakeContact(),
    ...fakeOpportunityDetails()
  }
}
