import { Maybe, Result } from 'true-myth'

import { OpportunityRepository } from '../../../domain/spi'
import { OpportunityId, OpportunityDetails, OpportunityUpdateAttributes } from '../../../domain/types'
import BrevoAPI from './brevoAPI'
import {
  DealAttributes,
  BrevoQuestionnaireRoute,
  QuestionnaireRoute,
  DealUpdateAttributes,
  BrevoPostDealPayload,
  BrevoDealResponse
} from './types'
import Config from '../../../../config'

// "Opportunities" are called "Deals" in Brevo

const addBrevoDeal: OpportunityRepository['create'] = async (
  contactId: number,
  domainOpportunity: OpportunityDetails
): Promise<Result<OpportunityId, Error>> => {
  const brevoDeal = convertDomainToBrevoDeal(domainOpportunity)

  const dealId = await requestCreateDeal(domainOpportunity.programId, brevoDeal)

  if (!dealId.isErr) {
    const maybeError = await associateBrevoDealToContact(dealId.value, contactId)
    if (maybeError.isJust)
      return Result.err(new Error('Something went wrong while attaching contact to opportunity', { cause: maybeError.value }))
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

  const dealId = responseResult.map((r) => r.data as OpportunityId)
  return dealId
}

const updateBrevoDeal: OpportunityRepository['update'] = async (
  dealId: OpportunityId,
  updateAttributes: OpportunityUpdateAttributes
): Promise<Maybe<Error>> => {
  const brevoDeal = convertDomainToBrevoDealUpdate(updateAttributes)

  return requestUpdateDeal(dealId, brevoDeal)
}

const requestUpdateDeal = async (dealId: OpportunityId, attributes: DealUpdateAttributes): Promise<Maybe<Error>> => {
  const responseResult = await new BrevoAPI().PatchDeal(dealId.id, {
    attributes: attributes
  })

  return Maybe.of(responseResult.isErr ? responseResult.error : null)
}

const associateBrevoDealToContact = async (dealId: OpportunityId, contactId: number): Promise<Maybe<Error>> => {
  const dealIdStr = dealId.id

  // associate brevo deal to contact
  const responsePatch = await new BrevoAPI().LinkDeal(dealIdStr, {
    linkContactIds: [contactId]
  })

  if (responsePatch.isErr) return Maybe.of(responsePatch.error)
  else return Maybe.nothing()
}

const convertDomainToBrevoDeal = (domainAttributes: OpportunityDetails): DealAttributes => {
  return {
    // Brevo does not handle newlines in attributes
    message: replaceNewlinesWithSpaces(domainAttributes.message),
    parcours: convertQuestionnaireRoute(domainAttributes.questionnaireRoute),
    ...(domainAttributes.priorityObjectives && { objectifs_renseigns: domainAttributes.priorityObjectives.join(', ') }),
    ...(domainAttributes.programContactOperator && { oprateur_de_contact: domainAttributes.programContactOperator }),
    ...(domainAttributes.otherData && { autres_donnes: domainAttributes.otherData })
  }
}

const convertDomainToBrevoDealUpdate = (domainUpdateAttributes: OpportunityUpdateAttributes): DealUpdateAttributes => {
  return {
    envoy: domainUpdateAttributes.sentToOpportunityHub
  }
}

const convertQuestionnaireRoute = (questionnaireRoute: QuestionnaireRoute | undefined): BrevoQuestionnaireRoute => {
  switch (questionnaireRoute) {
    case undefined:
      return BrevoQuestionnaireRoute.DIRECTORY
    case QuestionnaireRoute.SpecificGoal:
      return BrevoQuestionnaireRoute.SPECIFIC_GOAL
    case QuestionnaireRoute.NoSpecificGoal:
      return BrevoQuestionnaireRoute.NO_SPECIFIC_GOAL
  }
}

const replaceNewlinesWithSpaces = (text: string): string => {
  return text.replaceAll('\n', ' ')
}

const getBrevoCreationDates = async (): Promise<Result<Date[], Error>> => {
  const responsePatch = await new BrevoAPI().GetDeals()

  if (responsePatch.isOk) {
    const brevoDealResponse: BrevoDealResponse = responsePatch.value.data as BrevoDealResponse
    if (!brevoDealResponse.items) {
      return Result.err(new Error('No Items field in Brevo API'))
    }
    if (brevoDealResponse.items.length === 0) {
      return Result.err(new Error('Brevo deal list is empty'))
    }
    const dateList: Date[] = []
    for (const deal of brevoDealResponse.items) {
      const dealDate: Date = new Date(deal.attributes.created_at)
      dateList.push(dealDate)
    }
    return Result.ok(dateList)
  } else {
    return Result.err(responsePatch.error)
  }
}

export const brevoRepository: OpportunityRepository = { create: addBrevoDeal, update: updateBrevoDeal, readDates: getBrevoCreationDates }
