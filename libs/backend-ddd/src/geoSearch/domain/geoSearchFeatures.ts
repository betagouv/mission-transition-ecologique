import { GeoSearch } from './spi'
import { ConvertedCommune } from '@tee/common'

export class GeoSearchFeatures {
  private _geoSearchRepository: GeoSearch

  constructor(geoSearchService: GeoSearch) {
    this._geoSearchRepository = geoSearchService
  }

  /**
   * Search cities by name or postalCode
   * @param searchTerm : search input
   * @returns search results
   */

  public search(searchTerm: string): ConvertedCommune[] {
    // Automatically detect if the search term is a postal code (5 digits) or a name
    let results = []
    if (/^\d+$/.test(searchTerm)) {
      results = this._geoSearchRepository.searchByCityCode(searchTerm)
    } else {
      results = this._geoSearchRepository.searchByName(searchTerm)
    }
    return results.sort((a: { nom: string }, b: { nom: string }) => a.nom.localeCompare(b.nom))
  }
}
