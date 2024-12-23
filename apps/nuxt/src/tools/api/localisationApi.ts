import RequestApi from './requestApi'
import { Result } from 'true-myth'
import { ConvertedCommune } from '@tee/common'
import { ResultApi } from './resultApi'

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

  async searchCities(searchTerm: string): Promise<ResultApi<ConvertedCommune[]>> {
    const urlWithParams = this.buildQuery(`${this.url}/search`, searchTerm)
    return super.getJson<ConvertedCommune[]>(urlWithParams)
  }
}
