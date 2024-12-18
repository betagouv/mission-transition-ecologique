/* eslint-disable @typescript-eslint/no-explicit-any */
import { Deal, DealsApi, DealsApiApiKeys } from '@getbrevo/brevo'
import fs from 'fs'
import { DealStage } from './types'

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
  public async getDeals(): Promise<Array<Deal>> {
    // DEV CODE
    const filePath = 'deals.log'
    if (fs.existsSync(filePath)) {
      try {
        console.log('Reading deals from local file...')
        const data = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(data) as Array<Deal>
      } catch (error) {
        console.error('Error reading deals from file:', error)
        throw error // Handle or re-throw error if necessary
      }
    }
    // END DEV CODE
    let deals: Array<Deal> = []
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

    return deals
  }

  public formatDealStage: { [key in DealStage]: string } = {
    [DealStage.Nouvelle]: 'Nouvelle',
    [DealStage.Transmise]: 'Transmise',
    [DealStage.Perdue]: 'Perdue',
    [DealStage.AideProposee]: 'Aide Proposée',
    [DealStage.Gagnee]: 'Gagnée'
  }
}
