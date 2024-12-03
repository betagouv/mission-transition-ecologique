import { Controller, Get, Route, Query, Res, TsoaResponse } from 'tsoa'
import { ErrorJSON, GeoSearchService, Monitor } from '@tee/backend-ddd'
import { ConvertedCommune } from '@tee/common'

@Route('geoSearch')
export class GeoSearchController extends Controller {
  private readonly geoSearchService = new GeoSearchService()

  /**
   * Recherche des villes par nom ou code postal.
   * @param searchTerm - Nom ou code postal de la ville recherchée.
   * @returns Liste des villes correspondantes.
   */
  @Get('/search')
  public async searchCities(
    @Query() searchTerm: string,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>
  ): Promise<ConvertedCommune[]> {
    try {
      return this.geoSearchService.searchCity(searchTerm)
    } catch (error) {
      Monitor.error('Error in searchCities', { error: error })
      return requestFailedResponse(500, { message: 'Failed to fetch search results.' })
    }
  }
}
