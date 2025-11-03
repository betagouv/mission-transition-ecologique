import Config from '@/config'
import { FeedbackButtonPosition, FeedbackType } from '@/tools/feedback/feedbackType'

export class ConfigFeedback {
  private static _formId = 3733
  private static _url = 'https://jedonnemonavis.numerique.gouv.fr/Demarches/{formId}?button={buttonId}'

  static getUrl(position: FeedbackButtonPosition): string {
    const config = this.get(position)

    return this._url.replace('{formId}', config.formId.toString()).replace('{buttonId}', config.buttonId.toString())
  }

  static get config(): FeedbackType {
    const formId = { formId: this._formId }

    if (Config.isProduction()) {
      return {
        [FeedbackButtonPosition.Form]: { ...formId, buttonId: 4024 },
        [FeedbackButtonPosition.Footer]: { ...formId, buttonId: 4035 }
      }
    }

    return {
      [FeedbackButtonPosition.Form]: { ...formId, buttonId: 4033 },
      [FeedbackButtonPosition.Footer]: { ...formId, buttonId: 4034 }
    }
  }

  static get(position: FeedbackButtonPosition) {
    return this.config[position]
  }
}
