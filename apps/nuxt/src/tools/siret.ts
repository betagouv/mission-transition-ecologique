import Translation from '@/tools/translation'
import { EstablishmentSearch, SiretValidator } from '@tee/common'
import TrackSiret from '@/tools/questionnaire/track/TrackSiret'

export default class Siret {
  static async processInput(
    queryValue: string | undefined,
    numberOfResults: number
  ): Promise<EstablishmentSearch | { error: boolean; errorMsg: string }> {
    if (!queryValue || queryValue.length < 3) {
      return { error: true, errorMsg: Translation.t('enterprise.searchTooShort') }
    } else if (SiretValidator.isValidSiretFormat(queryValue) && !SiretValidator.isValidSiretNumber(queryValue)) {
      return { error: true, errorMsg: "Le numéro SIRET n'est pas valide" }
    } else {
      const searchResult = await TrackSiret.search(queryValue, numberOfResults)
      if (searchResult.isErr) {
        return { error: true, errorMsg: Translation.t('enterprise.apiError') }
      } else if (searchResult.value.resultCount == 0) {
        return { error: true, errorMsg: Translation.t('enterprise.noStructureFound') }
      } else {
        return searchResult.value
      }
    }
  }
}
