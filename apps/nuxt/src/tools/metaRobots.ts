import Config from '@/config'

export class MetaRobots {
  static indexFollow() {
    return this._setMetaRobots('index, follow')
  }

  static noIndexFollow() {
    return this._setMetaRobots('noindex, follow')
  }

  static noIndexNoFollow() {
    return this._setMetaRobots('noindex, nofollow')
  }

  static noIndexOnQueries(fullPath: string) {
    const shouldNoIndex = fullPath.includes('?')
    const content = shouldNoIndex ? 'noindex, follow' : 'index, follow'
    return this._setMetaRobots(content)
  }

  private static _setMetaRobots(value: string) {
    return {
      meta: [
        {
          name: 'robots',
          content: this._enforceProdOnly(value)
        }
      ]
    }
  }

  private static _enforceProdOnly(original: string): string {
    return Config.isProduction() ? original : 'noindex, nofollow'
  }
}
