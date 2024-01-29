import MetaEnv from '@/utils/metaEnv'

export default class Contact {
  private static readonly _email: string = MetaEnv.contactEmail

  static get email(): string {
    return this._email
  }

  static get mailTo() {
    return `mailto:${this._email}`
  }

  static get iframeSrc() {
    return `https://place-des-entreprises.beta.gouv.fr/aide-entreprise/france-transition-ecologique/theme/environnement-transition-ecologique`
  }
}
