import { GeoSearchFeatures } from '../domain/geoSearchFeatures'
import { ConvertedCommune } from '@tee/common'
import { Result } from 'true-myth'
import { GeoSearch } from '../domain/spi'
import { Localisation } from '../infrastructure/json/localisation'

export default class GeoSearchService {
  private _geoSearchFeatures: GeoSearchFeatures

  constructor() {
    this._geoSearchFeatures = new GeoSearchFeatures(this._getGeoSearchRepository())
  }

  /**
   * Search cities by name or postalCode
   * @param searchTerm : search input
   * @returns search results
   */
  public searchCities(searchTerm: string): Result<ConvertedCommune[], Error> {
    try {
      return Result.ok(this._geoSearchFeatures.search(searchTerm))
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }

  private _getGeoSearchRepository(): GeoSearch {
    return new Localisation()
  }
}
