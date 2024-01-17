import { Maybe, Result } from 'true-myth'

import { OpportunityRepository } from '../../../domain/spi'
import { OpportunityId, OpportunityDetails, OpportunityUpdateAttributes } from '../../../domain/types'
import { requestBrevoAPI } from './brevoRequest'
import { DealAttributes, HttpMethod, BrevoQuestionnaireRoute, DealUpdateAttributes } from './types'
import { TrackHelpValue } from '@tee/web/src/types'

// "Opportunities" are called "Deals" in Brevo

export const addBrevoDeal: OpportunityRepository['create'] = async (
  contactId: number,
  domainOpportunity: OpportunityDetails
): Promise<Result<OpportunityId, Error>> => {
  const brevoDeal = mapDomainToBrevoDeal(domainOpportunity)

  const dealId = await requestCreateDeal(domainOpportunity.programId, brevoDeal)

  if (!dealId.isErr) {
    const maybeError = await associateBrevoDealToContact(dealId.value, contactId)
    if (maybeError.isJust)
      return Result.err(new Error('Something went wrong while attaching contact to opportunity', { cause: maybeError.value }))
  }

  return dealId
}

const requestCreateDeal = async (name: string, attributes: DealAttributes): Promise<Result<OpportunityId, Error>> => {
  const responseResult = await requestBrevoAPI({
    method: HttpMethod.POST,
    url: 'https://api.brevo.com/v3/crm/deals',
    data: {
      name: name,
      attributes: attributes
    }
  })

  const dealId = responseResult.map((r) => r.data as OpportunityId)
  return dealId
}

export const updateBrevoDeal: OpportunityRepository['update'] = async (
  dealId: OpportunityId,
  updateAttributes: OpportunityUpdateAttributes
): Promise<Maybe<Error>> => {
  const brevoDeal = mapDomainToBrevoDealUpdate(updateAttributes)

  return requestUpdateDeal(dealId, brevoDeal)
}

const requestUpdateDeal = async (dealId: OpportunityId, attributes: DealUpdateAttributes): Promise<Maybe<Error>> => {
  const responseResult = await requestBrevoAPI({
    method: HttpMethod.PATCH,
    url: `https://api.brevo.com/v3/crm/deals/${dealId}`,
    data: {
      attributes: attributes
    }
  })

  return Maybe.of(responseResult.isErr ? responseResult.error : null)
}

const associateBrevoDealToContact = async (dealId: OpportunityId, contactId: number): Promise<Maybe<Error>> => {
  const dealIdStr = dealId.id

  // associate brevo deal to contact
  const responsePatch = await requestBrevoAPI({
    method: HttpMethod.PATCH,
    url: `https://api.brevo.com/v3/crm/deals/link-unlink/${dealIdStr}`,
    data: {
      linkContactIds: [contactId]
    }
  })

  if (responsePatch.isErr) return Maybe.of(responsePatch.error)
  else return Maybe.nothing()
}

const mapDomainToBrevoDeal = (domainAttributes: OpportunityDetails): DealAttributes => {
  return {
    message: domainAttributes.message,
    parcours: mapQuestionnaireRoute(domainAttributes.questionnaireRoute),
    ...(domainAttributes.priorityObjectives && { objectifs_renseigns: domainAttributes.priorityObjectives.join(', ') })
  }
}

const mapDomainToBrevoDealUpdate = (domainUpdateAttributes: OpportunityUpdateAttributes): DealUpdateAttributes => {
  return {
    envoy__bpifrance: domainUpdateAttributes.sentToBpifrance
  }
}

const mapQuestionnaireRoute = (questionnaireRoute: TrackHelpValue | undefined): BrevoQuestionnaireRoute => {
  if (!questionnaireRoute) return BrevoQuestionnaireRoute.DIRECTORY

  switch (questionnaireRoute) {
    case TrackHelpValue.Precise:
      return BrevoQuestionnaireRoute.SPECIFIC_GOAL
    case TrackHelpValue.Unknown:
      return BrevoQuestionnaireRoute.NO_SPECIFIC_GOAL
  }
}
