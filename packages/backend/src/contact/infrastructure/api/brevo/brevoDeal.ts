import { Result } from 'true-myth'

import { ContactInfoRepository } from '../../../domain/spi'
import { DealId } from '../../../domain/types'
import { requestBrevoAPI } from './brevoRequest'
import { HttpMethod } from './types'

export const addBrevoOpportunity: ContactInfoRepository['addOpportunity'] = async (
  contactId: number,
  _attributes: object
): Promise<Result<DealId, Error>> => {
  // create Brevo deal
  const responseResult = await requestBrevoAPI({
    method: HttpMethod.POST,
    url: 'https://api.brevo.com/v3/crm/deals',
    data: {
      name: 'abc',
      attributes: {}
    }
  })

  if (responseResult.isErr) return Result.err(responseResult.error)
  const response = responseResult.value

  const dealId = response.data.id

  // associate brevo deal to contact
  const responsePatch = await requestBrevoAPI({
    method: HttpMethod.PATCH,
    url: `https://api.brevo.com/v3/crm/deals/link-unlink/${dealId}`,
    data: {
      linkContactIds: [contactId]
    }
  })

  if (responsePatch.isErr) console.log(responsePatch.error)

  return Result.ok({ id: dealId })
}
