import { Maybe, Result } from 'true-myth'
import { OpportunityRepository } from '../../../../../../src/opportunity/domain/spi'
import { OpportunityDetailsShort, OpportunityId } from '../../../../../../src/opportunity/domain/types'

// "Opportunities" are called "Deals" in Brevo

const addBrevoDeal: OpportunityRepository['create'] = async (): Promise<Result<OpportunityId, Error>> => {
  return Result.ok({ id: '0' } as OpportunityId)
}

const updateBrevoDeal: OpportunityRepository['update'] = async (): Promise<Maybe<Error | null>> => {
  return Maybe.of(null)
}

const getBrevoCreationDates = async (): Promise<Result<Date[], Error>> => {
  return Result.ok([] as Date[])
}

const getDailyOpportunitiesByContactId = async (): Promise<Result<OpportunityDetailsShort[], Error>> => {
  return Result.ok([] as OpportunityDetailsShort[])
}

export const brevoRepositoryMock: OpportunityRepository = {
  create: addBrevoDeal,
  update: updateBrevoDeal,
  readDates: getBrevoCreationDates,
  getDailyOpportunitiesByContactId: getDailyOpportunitiesByContactId
}
