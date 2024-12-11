import { Controller, Get, Route, Query, Res, TsoaResponse } from 'tsoa'
import { ErrorJSON, GeoSearchService, Monitor } from '@tee/backend-ddd'
import { ConvertedCommune } from '@tee/common'

@Route('geoSearch')
export class GeoSearchController extends Controller {
  private readonly geoSearchService = new GeoSearchService()

  /**
   * Search cities by name or postalCode
   * @param searchTerm : search input
   * @returns search results
   */

  @Get('/search')
  public async searchCities(
    @Query() searchTerm: string,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ): Promise<ConvertedCommune[]> {
    const results = this.geoSearchService.searchCities(searchTerm)
    if (results.isOk) {
      return results.value
    } else {
      const err = results.error
      Monitor.error('Error in searchCities', { searchTerm, error: err })
      return requestFailedResponse(500, { message: 'Failed to fetch search results.' })
    }
  }
}
