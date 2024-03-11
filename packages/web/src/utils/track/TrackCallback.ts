import { useUsedTrackStore } from '@/stores/usedTrack'
import { CallbackActions, type ReqError, type ReqResp, type TrackOptionsUnion } from '@/types'
import { cleanValue, remapItem } from '@/utils/helpers'
import { sendApiRequest } from '@/utils/requests'
import Translation from '@/utils/translation'

export default class TrackCallback {
  static async applies(option: TrackOptionsUnion, value: string) {
    const responses: ReqResp[] = []
    const errors: ReqError[] = []
    if (option?.callbacks) {
      const activeCallbacks = option.callbacks.filter((callback) => !callback.disabled)
      const trackValues = useUsedTrackStore().completedUsedTracksValues
      // loop option's callbacks
      for (const callback of activeCallbacks) {
        // Clean input value
        if (callback.inputCleaning) {
          value = cleanValue(value, callback.inputCleaning) as string
        }
        let resp: ReqResp = {}
        if (callback.action === CallbackActions.RequestAPI) {
          resp = await sendApiRequest(callback, { inputValue: value }, trackValues)
        }
        if (resp.ok) {
          const item = remapItem(
            callback.dataStructure,
            callback.dataMapping,
            { inputValue: value },
            trackValues,
            undefined,
            resp,
            [],
            Translation.lang
          )
          responses.push({
            data: item,
            raw: resp,
            resultsMapping: callback.resultsMapping
          })
        } else {
          errors.push(resp)
        }
      }
    }

    return { responses, errors }
  }
}
