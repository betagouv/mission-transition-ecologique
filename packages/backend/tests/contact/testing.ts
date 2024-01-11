import { ContactDetails, Opportunity, OpportunityDetails } from '../../src/contact/domain/types'

export const fakeContact = (): ContactDetails => {
  return {
    name: 'name',
    forname: 'forname',
    email: 'test@email.com',
    phone: '0605040302',
    siret: '83014132100034'
  }
}

export const fakeOpportunityDetails = (): OpportunityDetails => {
  return {
    programId: 'test-program',
    message: 'Bonjour monde !'
  }
}

export const fakeOpportunity = (): Opportunity => {
  return {
    ...fakeContact(),
    ...fakeOpportunityDetails()
  }
}
