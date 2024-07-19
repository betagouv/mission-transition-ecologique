import * as Sentry from '@sentry/node'
import Config from '../../../config'

export default class Monitor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static error(message: string, data?: any) {
    Sentry.captureMessage(message, (scope) =>
      scope.addBreadcrumb({
        type: 'error',
        category: 'error',
        level: 'error',
        data: data
      })
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static warning(message: string, data?: any) {
    Sentry.captureMessage(message, (scope) =>
      scope.addBreadcrumb({
        type: 'warning',
        category: 'warning',
        level: 'warning',
        data: data
      })
    )
  }

  static debug(message: string) {
    if (Config.DEBUG) {
      console.log('debugging log : ', message)
    }
  }
}
