import { useUsedTrackStore } from '@/stores/usedTrack'
import { CallbackActions, type FormCallback, type ReqError, type ReqResp } from '@/types'
import { cleanValue, remapItem } from '@/tools/helpers'
import { sendApiRequest } from '@/tools/requests'
import Translation from '@/tools/translation'

export default class TrackCallback {
  static async applies(value: string, callbacks?: FormCallback[]) {
    const responses: ReqResp[] = []
    const errors: ReqError[] = []
    if (callbacks) {
      const activeCallbacks = callbacks.filter((callback) => !callback.disabled)
      const trackValues = useUsedTrackStore().completedQuestionnaireData
      // loop option's callbacks
      for (const callback of activeCallbacks) {
        // Clean input value
        if (callback.inputCleaning) {
          value = cleanValue(value, callback.inputCleaning) as string
        }
        let response: ReqResp = {}
        if (callback.action === CallbackActions.RequestAPI) {
          response = await sendApiRequest(callback, { inputValue: value }, trackValues)
        }
        if (response.ok) {
          const item = remapItem(
            callback.dataStructure,
            callback.dataMapping,
            { inputValue: value },
            trackValues,
            undefined,
            response,
            [],
            Translation.lang
          )
          responses.push({
            data: item,
            resultsMapping: callback.resultsMapping
          })
        } else {
          errors.push(response)
        }
      }
    }

    return { responses, errors }
  }
}
