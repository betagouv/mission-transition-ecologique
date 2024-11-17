import RequestApi from '@/service/api/requestApi'
import { Result } from 'true-myth'
import { ConvertedCommune } from '@tee/common'

export default class LocalisationApi extends RequestApi {
  protected readonly url = '/api/geoSearch'
  private readonly _headers = {
    accept: 'application/json',
    'content-type': 'application/json'
  }
  constructor() {
    super()
  }

  async searchCities(searchTerm: string): Promise<Result<ConvertedCommune[], Error>> {
    const urlWithParams = `${this.url}/search?searchTerm=${encodeURIComponent(searchTerm)}`
    return super.getJson(urlWithParams)
  }
}
