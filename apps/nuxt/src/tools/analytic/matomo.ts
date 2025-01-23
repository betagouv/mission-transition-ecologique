import Config from '@/config'

export default class Matomo {
  static sendEvent(action: string, name: string | null = null, value?: string | number | undefined) {
    this.trackEvent('from_domain', location.hostname)
    if (name) {
      // Track by action
      this.trackEvent(action, name, value)
    }
  }

  static trackEvent = (
    evCategory: string,
    evAction: string,
    evName: string | number | undefined = undefined,
    EvValue: number | undefined = undefined
  ) => {
    if (Config.hasMatomo()) {
      const { proxy } = useScriptMatomoAnalytics()
      if (proxy._paq) {
        proxy._paq.push(['trackEvent', evCategory, evAction, evName, EvValue])
      }
    }
  }
}
