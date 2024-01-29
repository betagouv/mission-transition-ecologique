import MetaEnv from '@/utils/metaEnv'

export default class Contact {
  private static readonly _email: string = MetaEnv.contactEmail

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

  static get iframeSrc() {
    return `https://place-des-entreprises.beta.gouv.fr/aide-entreprise/france-transition-ecologique/theme/environnement-transition-ecologique`
  }
}
