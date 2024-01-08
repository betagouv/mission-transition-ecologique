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

  const dealId = responseResult.map((r) => r.data as DealId)

  if (!dealId.isErr) {
    // associate brevo deal to contact
    const responsePatch = await requestBrevoAPI({
      method: HttpMethod.PATCH,
      url: `https://api.brevo.com/v3/crm/deals/link-unlink/${dealId.map((d) => d.id)}`,
      data: {
        linkContactIds: [contactId]
      }
    })
    if (responsePatch.isErr)
      return Result.err(new Error('Something went wrong while attaching contact to opportunity', { cause: responsePatch.error }))
  }

  return dealId
}
