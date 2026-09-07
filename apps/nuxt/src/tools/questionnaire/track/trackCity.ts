import { CompanyDataRegisterType, CompanyLocalisationType, ConvertedCommune, Region, Track, TrackOptionsUnion } from '@/types'
import { normalizeString } from '@tee/common'

// The postal code alone is ambiguous (several cities share it), so the city name is appended
const SEARCH_PARAM_SEPARATOR = '-'
const POSTAL_CODE_PATTERN = /^\d{5}$/

export default class TrackCity {
  /**
   * Serializes the stored localisation as an url search param value, e.g. "34000-Montpellier"
   */
  static toSearchParamValue(company: CompanyDataRegisterType): string | undefined {
    if (!company?.codePostal || !company.ville) {
      return undefined
    }

    return `${company.codePostal}${SEARCH_PARAM_SEPARATOR}${company.ville}`
  }

  static async getOptionByValue(track: Track, value: string): Promise<TrackOptionsUnion | undefined> {
    const option = track.options?.find(() => true)
    if (option === undefined) {
      return undefined
    }

    const commune = await this._findCommune(value)
    if (commune === undefined) {
      return undefined
    }

    return {
      ...option,
      value: value,
      questionnaireData: this._toLocalisation(commune)
    } as TrackOptionsUnion
  }

  private static async _findCommune(value: string): Promise<ConvertedCommune | undefined> {
    const [postalCode, ...cityNameParts] = value.split(SEARCH_PARAM_SEPARATOR)
    const cityName = cityNameParts.join(SEARCH_PARAM_SEPARATOR)

    if (!POSTAL_CODE_PATTERN.test(postalCode) || cityName === '') {
      return undefined
    }

    // Note: do not use LocalisationApi, its useFetch based call cannot run from a route middleware
    try {
      const communes = await $fetch<ConvertedCommune[]>(`/api/geoSearch/${postalCode}`)

      return communes.find((commune) => commune.codePostal === postalCode && normalizeString(commune.nom) === normalizeString(cityName))
    } catch {
      return undefined
    }
  }

  private static _toLocalisation(commune: ConvertedCommune): CompanyLocalisationType {
    return {
      region: commune.region.nom as Region,
      ville: commune.nom,
      codePostal: commune.codePostal
    }
  }
}
