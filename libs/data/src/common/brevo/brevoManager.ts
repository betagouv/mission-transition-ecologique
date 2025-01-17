/* eslint-disable @typescript-eslint/no-explicit-any */
import { Deal, DealsApi, DealsApiApiKeys } from '@getbrevo/brevo'
import fs from 'fs'
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
    // DEV CODE
    const filePath = 'deals.log'
    if (fs.existsSync(filePath)) {
      try {
        console.log('Reading deals from local file...')
        const data = fs.readFileSync(filePath, 'utf-8')
        const deals = JSON.parse(data) as Deal[]
        return this._convertRawDealsToBrevoDeals(deals)
      } catch (error) {
        console.error('Error reading deals from file:', error)
        throw error // Handle or re-throw error if necessary
      }
    }
    // END DEV CODE
    let deals: Deal[] = []
    const limit = 100000

    try {
      const response = await this._dealsApi.crmDealsGet(undefined, undefined, undefined, undefined, limit)
      if (response.body.items) {
        deals = response.body.items
      }
      console.log(deals.length)
      fs.writeFileSync(filePath, JSON.stringify(deals, null, 2), 'utf-8') // TODO DEV CODE TO DELETE
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
          console.log(`Invalid dealStageId: ${dealStageId}`)
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
