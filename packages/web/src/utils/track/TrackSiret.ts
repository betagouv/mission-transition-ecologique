import { SiretValue } from '@/types'
import type { Track, TrackOptionItem, TrackOptionsUnion, EstablishmentType } from '@/types'
import TrackCallback from '@/utils/track/TrackCallback'

export default class TrackSiret {
  static createData(
    option: TrackOptionsUnion,
    value?: string,
    questionnaireData?: EstablishmentType,
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
    if (!option?.validation || !option?.validation(siret)) {
      return undefined
    }

    const callBackReturn = await TrackCallback.applies(siret, option?.callbacks)
    if (callBackReturn.responses.length === 0) {
      return undefined
    }

    return TrackSiret.createData(option, siret, callBackReturn.responses[0].data as EstablishmentType).option
  }
}
