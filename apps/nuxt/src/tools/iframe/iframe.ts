export class Iframe {
  static getScript() {
    const deployUrl = useRuntimeConfig().public.deployUrl
    if (deployUrl) {
      return deployUrl + '/scripts/iframe.js'
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
