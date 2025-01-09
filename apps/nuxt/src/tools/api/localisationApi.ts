import RequestApi from '@/tools/api/requestApi'
import { ResultApi } from '@/tools/api/resultApi'
import { ConvertedCommune } from '@tee/common'

export default class LocalisationApi extends RequestApi {
  protected readonly url = '/api/geoSearch/'

  async searchCities(searchTerm: string): Promise<ResultApi<ConvertedCommune[]>> {
    return await super.getJson<ConvertedCommune[]>(this.url + searchTerm)
  }
}
