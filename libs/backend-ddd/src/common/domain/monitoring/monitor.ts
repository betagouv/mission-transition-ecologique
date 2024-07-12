import * as Sentry from '@sentry/node'
import Config from '../../../config'

export default class Monitor {
  error(details: string) {
    Sentry.captureMessage(details, 'error')
  }
  warning(details: string) {
    Sentry.captureMessage(details, 'warning')
  }
  debug(details: string) {
    if (Config.DEBUG) {
      console.log('debugging log : ', details)
    }
  }
}
