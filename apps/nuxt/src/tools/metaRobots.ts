import Config from '@/config'

export class MetaRobots {
  static enforceProdOnly(original: string): string {
    return true ? original : 'noindex, nofollow'
  }

  static indexFollow() {
    return {
      meta: [
        {
          name: 'robots',
          content: this.enforceProdOnly('index, follow')
        }
      ]
    }
  }

  static noIndexFollow() {
    return {
      meta: [
        {
          name: 'robots',
          content: this.enforceProdOnly('noindex, follow')
        }
      ]
    }
  }

  static noIndexNoFollow() {
    return {
      meta: [
        {
          name: 'robots',
          content: this.enforceProdOnly('noindex, nofollow')
        }
      ]
    }
  }

  static noIndexOnQueries(fullPath: string) {
    const shouldNoIndex = fullPath.includes('?')
    const content = shouldNoIndex ? 'noindex, follow' : 'index, follow'
    return {
      meta: [
        {
          name: 'robots',
          content: this.enforceProdOnly(content)
        }
      ]
    }
  }
}
