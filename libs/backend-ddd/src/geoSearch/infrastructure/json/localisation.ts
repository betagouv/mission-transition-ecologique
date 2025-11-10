import { communes } from '@tee/data/static'
import { ConvertedCommune, Commune, normalizeString } from '@tee/common'
import { GeoSearch } from '../../domain/spi'

export class Localisation implements GeoSearch {
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

  public searchByName(searchValue: string): ConvertedCommune[] {
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
