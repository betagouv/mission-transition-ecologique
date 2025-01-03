import RequestApi from '@/tools/api/requestApi'
import { Result } from 'true-myth'
import { ConvertedCommune } from '@tee/common'

export default class LocalisationApi extends RequestApi {
  protected readonly url = '/api/geoSearch'

  constructor() {
    super()
  }
  protected buildQuery(baseURL: string, param: string): string {
    const url = new URL(baseURL, window.location.origin)
    url.searchParams.set('searchTerm', param)
    return url.toString()
  }

  async searchCities(searchTerm: string): Promise<Result<ConvertedCommune[], Error>> {
    const urlWithParams = this.buildQuery(`${this.url}/search`, searchTerm)
    try {
      const data = await super.getJson<ConvertedCommune[]>(urlWithParams)
      return data
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }
}
