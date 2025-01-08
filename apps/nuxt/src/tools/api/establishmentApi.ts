import RequestApi from '@/tools/api/requestApi'
import { ResultApi } from '@/tools/api/resultApi'
import { EstablishmentSearch } from '@/types'

export default class EstablishmentApi extends RequestApi {
  protected readonly url = '/api/establishments/'

  async getByQuery(query: string, count?: number): Promise<ResultApi<EstablishmentSearch>> {
    const url: string = this.url + query + (count ? `?count=${count}` : '')
    return await this.getJson<EstablishmentSearch>(url)
  }
}
