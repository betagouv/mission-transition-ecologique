import RequestApi from '@/tools/api/requestApi'
import { Result } from 'true-myth'
import { EstablishmentSearch, CompanyActivityType } from '@/types'
import { ResultApi } from '@/tools/api/resultApi'

export default class EstablishmentApi extends RequestApi {
  protected readonly url = '/api/establishments/'

  async getByQuery(query: string, count?: number): Promise<Result<EstablishmentSearch, Error>> {
    const url: string = this.url + query + (count ? `?count=${count}` : '')
    try {
      // Note: Do not use this.getJson<EstablishmentSearch>(url) because it will not work
      const response = await fetch(url)
      if (!response.ok) {
        return Result.err(new Error())
      }
      return Result.ok((await response.json()) as EstablishmentSearch)
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }

  async searchActivities(): Promise<ResultApi<CompanyActivityType[]>> {
    return await super.getJson<CompanyActivityType[]>(`${this.url}searchNAF`)
  }
}
