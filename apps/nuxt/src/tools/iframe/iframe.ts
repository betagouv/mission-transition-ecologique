export class Iframe {
  private static readonly _iframeScriptPath = '/scripts/iframe.js'

  static getScript() {
    if (import.meta.client) {
      return window.location.origin + this._iframeScriptPath
    }
  }

  static is(): boolean {
    try {
      return window.self !== window.top
    } catch (e) {
      return true
    }
  }
}
