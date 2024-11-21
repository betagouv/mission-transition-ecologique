import RequestApi from '@/service/api/requestApi'
import { Result } from 'true-myth'
import { ConvertedCommune } from '@tee/common'

export default class LocalisationApi extends RequestApi {
  protected readonly url = '/api/geoSearch'

  async searchCities(searchTerm: string): Promise<Result<ConvertedCommune[], Error>> {
    const urlWithParams = `${this.url}/search?searchTerm=${encodeURIComponent(searchTerm)}`
    try {
      const response = await fetch(urlWithParams)
      if (!response.ok) {
        return Result.err(new Error())
      }
      return Result.ok((await response.json()) as ConvertedCommune[])
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }
}
