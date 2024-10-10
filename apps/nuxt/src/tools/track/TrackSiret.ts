import EstablishmentApi from '@/service/api/establishmentApi'
import { EstablishmentFront, SiretValue } from '@/types'
import type { Track, TrackOptionItem, TrackOptionsUnion } from '@/types'
import { SiretValidator } from '@tee/common'

export default class TrackSiret {
  static async search(query: string) {
    return await new EstablishmentApi().getByQuery(query)
  }

  static createData(
    option: TrackOptionsUnion,
    value?: string,
    questionnaireData?: EstablishmentFront,
    remove = false,
    forceKeep = false
  ): TrackOptionItem {
    return {
      option: {
        ...option,
        value: value,
        questionnaireData: questionnaireData || option.questionnaireData
      } as TrackOptionsUnion,
      remove: remove,
      forceKeep: forceKeep
    }
  }

  static async getOptionBySiret(track: Track, siret: string): Promise<TrackOptionsUnion | undefined> {
    const option = track.options?.find(() => true)

    if (option === undefined) {
      return undefined
    }

    if (siret === (SiretValue.Wildcard as string)) {
      return TrackSiret.createData(option, siret).option
    }

    if (!SiretValidator.validate(siret)) {
      return undefined
    }

    const searchResult = await this.search(siret)
    if (searchResult.isErr || searchResult.value.resultCount == 0) {
      return undefined
    }

    return TrackSiret.createData(option, siret, searchResult.value.establishments[0]).option
  }
}
