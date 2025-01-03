import RequestApi from '@/tools/api/requestApi'
import { Result } from 'true-myth'
import { ConvertedCommune } from '@tee/common'

export default class LocalisationApi extends RequestApi {
  protected readonly url = '/api/geoSearch/'

  async searchCities(searchTerm: string): Promise<Result<ConvertedCommune[], Error>> {
    const url: string = this.url + searchTerm
    try {
      const data = await fetch(url)
      if (!data.ok) {
        return Result.err(new Error())
      }
      return Result.ok((await data.json()) as ConvertedCommune[])
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }
}
