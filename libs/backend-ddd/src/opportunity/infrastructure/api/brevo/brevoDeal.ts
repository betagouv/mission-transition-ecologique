import { Operators } from '@tee/data'
import { Maybe, Result } from 'true-myth'
import Monitor from '../../../../common/domain/monitoring/monitor'
import Config from '../../../../config'
import { OpportunityAssociatedData } from '../../../domain/opportunityAssociatedData'
import { OpportunityRepository } from '../../../domain/spi'
import {
  OpportunityDetailsShort,
  OpportunityId,
  OpportunityUpdateAttributes,
  OpportunityWithOperatorContact,
  OpportunityWithOperatorContactAndContactId
} from '../../../domain/types'
import BrevoAPI from './brevoAPI'
import { BrevoDealItem, BrevoDealResponse, BrevoPostDealPayload, DealAttributes, DealUpdateAttributes } from './types'

// "Opportunities" are called "Deals" in Brevo

const addBrevoDeal: OpportunityRepository['create'] = async (
  domainOpportunity: OpportunityWithOperatorContactAndContactId,
  opportunityAssociatedObject: OpportunityAssociatedData
): Promise<Result<OpportunityId, Error>> => {
  const brevoDeal = convertDomainToBrevoDeal(domainOpportunity)

  let name = domainOpportunity.id
  if (opportunityAssociatedObject.isProject()) {
    name = opportunityAssociatedObject.data.slug
  }

  const dealId = await requestCreateDeal(name, brevoDeal)

  if (!dealId.isErr) {
    const maybeError = await associateBrevoDealToContact(dealId.value, domainOpportunity.contactId)
    if (maybeError.isJust) {
      return Result.err(new Error('Something went wrong while attaching contact to opportunity', { cause: maybeError.value }))
    }
  }

  return dealId
}

const requestCreateDeal = async (name: string, attributes: DealAttributes): Promise<Result<OpportunityId, Error>> => {
  const payload: BrevoPostDealPayload = {
    name: name,
    attributes: attributes
  }
  if (Config.BREVO_DEAL_PIPELINE) {
    payload.attributes.pipeline = Config.BREVO_DEAL_PIPELINE
  }
  const responseResult = await new BrevoAPI().PostDeal(payload)
  if (responseResult.isErr) {
    Monitor.error('Error in Brevo PostDeal api call', { payload: payload, error: responseResult.error })

    return Result.err(responseResult.error)
  }

  return responseResult.map((r) => r.data as OpportunityId)
}

const updateBrevoDeal: OpportunityRepository['update'] = async (
  dealId: OpportunityId,
  updateAttributes: OpportunityUpdateAttributes
): Promise<Maybe<Error | null>> => {
  const brevoDeal = convertDomainToBrevoDealUpdate(updateAttributes)
  console.log('Updating Brevo deal', { dealId: dealId.id, brevoDeal })
  return requestUpdateDeal(dealId, brevoDeal)
}

const requestUpdateDeal = async (dealId: OpportunityId, attributes: DealUpdateAttributes): Promise<Maybe<Error>> => {
  const responseResult = await new BrevoAPI().PatchDeal(dealId.id, {
    attributes: attributes
  })

  if (responseResult.isErr) {
    Monitor.error('Error in Brevo PatchDeal api call', { dealID: dealId.id, attributes, error: responseResult.error })
  }

  return Maybe.of(responseResult.isErr ? responseResult.error : null)
}

const associateBrevoDealToContact = async (dealId: OpportunityId, contactId: number): Promise<Maybe<Error>> => {
  const dealIdStr = dealId.id

  // associate brevo deal to contact
  const responsePatch = await new BrevoAPI().LinkDeal(dealIdStr, {
    linkContactIds: [contactId]
  })

  if (responsePatch.isErr) {
    Monitor.error('Error in Brevo LinkDeal (to contact) api call', { dealId: dealIdStr, contactId, error: responsePatch.error })
    return Maybe.of(responsePatch.error)
  } else {
    return Maybe.nothing()
  }
}

const convertDomainToBrevoDeal = (domainAttributes: OpportunityWithOperatorContact): DealAttributes => {
  return {
    // Brevo does not handle newlines in attributes
    message: replaceNewlinesWithSpaces(domainAttributes.message),
    ...(domainAttributes.priorityObjectives && { objectifs_renseigns: domainAttributes.priorityObjectives.join(', ') }),
    ...(domainAttributes.programContactOperator && { oprateur_de_contact: domainAttributes.programContactOperator }),
    ...(domainAttributes.otherData && { autres_donnes: domainAttributes.otherData }),
    type: domainAttributes.type
  }
}

const convertDomainToBrevoDealUpdate = (domainUpdateAttributes: OpportunityUpdateAttributes): DealUpdateAttributes => {
  return {
    envoy: domainUpdateAttributes.sentToOpportunityHub,
    idce: domainUpdateAttributes.idCe.toString()
  }
}

const replaceNewlinesWithSpaces = (text: string): string => {
  return text.replaceAll('\n', ' ')
}

const getBrevoCreationDates = async (): Promise<Result<Date[], Error>> => {
  const response = await new BrevoAPI().GetDeals()

  if (response.isOk) {
    const brevoDealResponse: BrevoDealResponse = response.value.data as BrevoDealResponse
    if (!brevoDealResponse.items || brevoDealResponse.items.length === 0) {
      Monitor.error("Brevo deal list doesn't exist or is empty empty", { BrevoResponse: brevoDealResponse })

      return Result.err(new Error("Brevo deal list doesn't exist or is empty"))
    }
    const dateList: Date[] = []
    for (const deal of brevoDealResponse.items) {
      if (deal.attributes.pipeline != Config.BREVO_DEAL_PIPELINE) {
        continue
      }
      const dealDate: Date = new Date(deal.attributes.created_at)
      dateList.push(dealDate)
    }
    return Result.ok(dateList)
  } else {
    Monitor.error('Error in brevo GetDeal api call', { error: response.error })
    return Result.err(response.error)
  }
}

const getDailyOpportunitiesByContactId = async (contactId: number): Promise<Result<OpportunityDetailsShort[], Error>> => {
  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  const response = await new BrevoAPI().GetDeals(startDate)
  if (response.isOk) {
    const brevoDealResponse: BrevoDealResponse = response.value.data as BrevoDealResponse
    if (!brevoDealResponse.items || brevoDealResponse.items.length === 0) {
      return Result.ok([])
    }
    const selectedDeals = [] as OpportunityDetailsShort[]
    for (const deal of brevoDealResponse.items) {
      if (deal.linkedContactsIds && deal.linkedContactsIds[0] === contactId) {
        selectedDeals.push(convertBrevoDealToDomain(deal))
      }
    }
    return Result.ok(selectedDeals)
  } else {
    Monitor.error('Error in brevo GetDeal api call', { error: response.error })
    return Result.err(response.error)
  }
}

const convertBrevoDealToDomain = (brevoAttributes: BrevoDealItem): OpportunityDetailsShort => {
  return {
    id: brevoAttributes.attributes.deal_name,
    programContactOperator: brevoAttributes.attributes.operateur_de_contact as Operators
  }
}

export const brevoRepository: OpportunityRepository = {
  create: addBrevoDeal,
  update: updateBrevoDeal,
  readDates: getBrevoCreationDates,
  getDailyOpportunitiesByContactId: getDailyOpportunitiesByContactId
}
