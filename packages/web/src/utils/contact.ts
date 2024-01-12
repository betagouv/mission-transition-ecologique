import { metaEnv } from '@/utils/global'

export default class Contact {
  private static readonly _email: string = metaEnv.VITE_CONTACT_EMAIL

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
