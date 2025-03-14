import Config from '@/config'

export default class Contact {
  private static readonly _email: string = Config.contactEmail

  static get email(): string {
    return this._email
  }

  static get mailTo() {
    return `mailto:${this._email}`
  }

  static getMailtoUrl(subject?: string | undefined, body?: string | undefined) {
    const queries: string[] = []
    if (subject) {
      queries.push('subject=' + encodeURIComponent(subject))
    }
    if (body) {
      queries.push('body=' + encodeURIComponent(body))
    }

    let url = this.mailTo
    if (queries.length > 0) {
      url += '?' + queries.join('&')
    }
    return url
  }
}
