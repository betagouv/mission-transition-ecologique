import { communes } from '@tee/data/references'
import { ConvertedCommune, Commune } from '@tee/common'

export default class GeoSearchService {
  private _cities: Commune[]
  private _citiesByPostalCode: ConvertedCommune[]

  constructor() {
    this._cities = communes as Commune[]
    this._citiesByPostalCode = this.separateCitiesByPostalCode()
  }

  private separateCitiesByPostalCode(): ConvertedCommune[] {
    return this._cities.flatMap((city: Commune) =>
      city.codesPostaux.map((postalCode: string) => ({
        ...city,
        codePostal: postalCode
      }))
    )
  }

  public searchCity(searchTerm: string): ConvertedCommune[] {
    // Automatically detect if the search term is a postal code (5 digits) or a name
    let results = []
    if (/^\d+$/.test(searchTerm)) {
      results = this.searchByCityCode(searchTerm)
    } else {
      results = this.searchByName(searchTerm)
    }

    return results.sort((a: { nom: string }, b: { nom: string }) => a.nom.localeCompare(b.nom))
  }
  public searchByName(searchValue: string): ConvertedCommune[] {
    const normalizeString = (str: string) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[-\s]/g, '')
        .trim()
    const normalizedSearch = normalizeString(searchValue)
    return this._citiesByPostalCode.filter((pair: { nom: string }) => {
      const normalizedCity = normalizeString(pair.nom)

      return normalizedCity.startsWith(normalizedSearch)
    })
  }

  public searchByCityCode(searchValue: string): ConvertedCommune[] {
    return this._citiesByPostalCode.filter((pair: { codePostal: string }) => pair.codePostal.startsWith(searchValue))
  }
}
