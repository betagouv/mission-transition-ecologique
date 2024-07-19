import * as Sentry from '@sentry/node'
import Config from '../../../config'

export default class Monitor {
  private static _debug: boolean = Config.DEBUG as unknown as boolean
  private static _message?: string

  static error(message: string, data?: { [key: string]: unknown }) {
    Sentry.captureMessage(message, (scope) =>
      scope.addBreadcrumb({
        type: 'error',
        category: 'error',
        level: 'error',
        data: data
      })
    )

    this._message = message
    this.log()

    return this
  }

  static warning(message: string, data?: { [key: string]: unknown }) {
    Sentry.captureMessage(message, (scope) =>
      scope.addBreadcrumb({
        type: 'warning',
        category: 'warning',
        level: 'warning',
        data: data
      })
    )

    this._message = message
    this.log()

    return this
  }

  static withDebug() {
    this._debug = true
    this.log()

    return this
  }

  static log(message: string | undefined = undefined, force = false) {
    if (this._debug || force) {
      if (message) {
        this._message = message
      }
      if (this._message) {
        console.log('debugging log : ', this._message)
        this._message = undefined
        this._debug = Config.DEBUG as unknown as boolean
      }
    }

    return this
  }
}
