import { Maybe, Result } from 'true-myth'

import { ContactInfoRepository } from '../../../domain/spi'
import { DealId, OpportunityDetails } from '../../../domain/types'
import { requestBrevoAPI } from './brevoRequest'
import { DealAttributes, HttpMethod, BrevoQuestionnaireRoute } from './types'
import { TrackHelpValue } from '@tee/web/src/types'

export const addBrevoOpportunity: ContactInfoRepository['addOpportunity'] = async (
  contactId: number,
  attributes: OpportunityDetails
): Promise<Result<DealId, Error>> => {
  const brevoDealAttributes = convertDomainToBrevoDeal(attributes)
  // create Brevo deal
  const responseResult = await requestBrevoAPI({
    method: HttpMethod.POST,
    url: 'https://api.brevo.com/v3/crm/deals',
    data: {
      name: attributes.programId,
      attributes: brevoDealAttributes
    }
  })

  const dealId = responseResult.map((r) => r.data as DealId)

  if (!dealId.isErr) {
    const maybeError = await associateBrevoDealToContact(dealId.value, contactId)
    if (maybeError.isJust)
      return Result.err(new Error('Something went wrong while attaching contact to opportunity', { cause: maybeError.value }))
  }

  return dealId
}

const associateBrevoDealToContact = async (dealId: DealId, contactId: number): Promise<Maybe<Error>> => {
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

const convertDomainToBrevoDeal = (domainAttributes: OpportunityDetails): DealAttributes => {
  return {
    message: domainAttributes.message,
    parcours: translateQuestionnaireRoute(domainAttributes.questionnaireRoute),
    ...(domainAttributes.priorityObjectives && { objectifs_renseigns: domainAttributes.priorityObjectives.join(', ') })
  }
}

const translateQuestionnaireRoute = (questionnaireRoute: TrackHelpValue | undefined): BrevoQuestionnaireRoute => {
  if (!questionnaireRoute) return BrevoQuestionnaireRoute.DIRECTORY

  switch (questionnaireRoute) {
    case TrackHelpValue.Precise:
      return BrevoQuestionnaireRoute.SPECIFIC_GOAL
    case TrackHelpValue.Unknown:
      return BrevoQuestionnaireRoute.NO_SPECIFIC_GOAL
  }
}
