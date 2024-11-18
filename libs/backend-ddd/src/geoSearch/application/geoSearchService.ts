import { communes } from '@tee/data/references'
import { ConvertedCommune, Commune } from '@tee/common'

export default class GeoSearchService {
  private _cities: Commune[]
  private _citiesByPostalCode: ConvertedCommune[]

  constructor() {
    this._cities = communes as Commune[]
    this._citiesByPostalCode = this.separateCitiesByPostalCode()
  }

  public separateCitiesByPostalCode(): ConvertedCommune[] {
    return this._cities.flatMap((city: Commune) =>
      city.codesPostaux.map((postalCode: string) => ({
        ...city,
        codePostal: postalCode
      }))
    )
  }

  public searchCity(searchTerm: string): ConvertedCommune[] {
    // Automatically detect if the search term is a postal code (5 digits) or a name
    if (searchTerm && /^\d{5}$/.test(searchTerm)) {
      return this.searchByCityCode(searchTerm)
    } else {
      return this.searchByName(searchTerm)
    }
  }
  public searchByName(searchValue: string): ConvertedCommune[] {
    return this._citiesByPostalCode.filter((pair: { nom: string }) => pair.nom.toLowerCase().includes(searchValue))
  }

  public searchByCityCode(searchValue: string): ConvertedCommune[] {
    return this._citiesByPostalCode.filter((pair: { codePostal: string }) => pair.codePostal.includes(searchValue))
  }
}
