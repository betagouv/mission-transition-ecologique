import { Deal, DealsApi, DealsApiApiKeys } from '@getbrevo/brevo'
import { BrevoDeal, DealStageIdToStage, RawBrevoDealAttributes } from './types'

export default class BrevoManager {
  private _dealsApi = new DealsApi()

  constructor() {
    this._dealsApi.setApiKey(DealsApiApiKeys.apiKey, process.env['BREVO_API_TOKEN'] || '')
  }

  /**
   * Fetch all deals from a specific pipeline updated after a given date.
   * @param updatedAfter The date after which deals were updated.
   * @returns A list of deals.
   */
  public async getDeals(): Promise<BrevoDeal[]> {
    let deals: Deal[] = []
    try {
      const limit = 3000
      const response = await this._dealsApi.crmDealsGet(undefined, undefined, undefined, undefined, limit)
      if (response.body.items) {
        deals = response.body.items
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    }
    return this._convertRawDealsToBrevoDeals(deals)
  }

  private _convertRawDealsToBrevoDeals(deals: Deal[]): BrevoDeal[] {
    return deals
      .map((deal) => {
        const attributes = deal.attributes as RawBrevoDealAttributes

        const creationDate = attributes['created_at']
        const dealStageId = attributes['deal_stage']

        const status = DealStageIdToStage[dealStageId]
        if (!status) {
          return {}
        }

        return {
          dealId: deal['id'],
          creationDate,
          status
        }
      })
      .filter((deal) => deal.dealId && deal.creationDate && deal.status) as BrevoDeal[]
  }
}
