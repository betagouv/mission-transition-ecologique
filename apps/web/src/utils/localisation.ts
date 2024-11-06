import { GeoResult, ConvertedGeoResult } from '@/types'

export class Localisation {
  static separateByPostalCode(cities: GeoResult[]): ConvertedGeoResult[] {
    return cities.flatMap((city: GeoResult) =>
      city.codesPostaux.map((postalCode: string) => ({
        ...city,
        codePostal: postalCode
      }))
    )
  }
}
