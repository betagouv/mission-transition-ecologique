import RequestApi from '@/service/api/requestApi'
import { Result } from 'true-myth'
import { EstablishmentSearch } from '@/types'

export default class EstablishmentApi extends RequestApi {
  protected readonly url = '/api/establishments/'

  async getByQuery(query: string, resultCount?: number): Promise<Result<EstablishmentSearch, Error>> {
    const url: string = this.url + query + (resultCount ? `?resultCount=${resultCount}` : '')
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return Result.err(new Error())
      }
      return Result.ok((await response.json()) as EstablishmentSearch)
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }
}
