import { GeoSearch } from './spi'
import { ConvertedCommune } from '@tee/common'

export class GeoSearchFeatures {
  private geoSearchService: GeoSearch

  constructor(geoSearchService: GeoSearch) {
    this.geoSearchService = geoSearchService
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
      results = this.geoSearchService.searchByCityCode(searchTerm)
    } else {
      results = this.geoSearchService.searchByName(searchTerm)
    }
    return results.sort((a: { nom: string }, b: { nom: string }) => a.nom.localeCompare(b.nom))
  }
}
