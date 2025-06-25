import { UseSeoMetaInput } from '@unhead/vue'

export class MetaSeo {
  private static readonly _baseTitle = 'Transition écologique des TPE & PME'
  private static readonly _defaultTitle = 'Aides et financements personnalisés'
  private static readonly _defaultImage = '/images/TEE-social-network-sharing.webp'
  public static readonly defaultDescription =
    'Service public pour les entreprises : Accédez simplement aux aides, accompagnements et financements disponibles pour les entreprises de votre secteur'

  static readonly get = (title?: string, description?: string): UseSeoMetaInput => {
    return this._buildMeta(this.title(title), this._defaultImage, this._description(description))
  }

  static readonly default = () => {
    return this._buildMeta(this.title(), this._defaultImage, this.defaultDescription)
  }

  public static readonly title = (title?: string) => {
    return `${title || this._defaultTitle} - ${this._baseTitle}`
  }

  private static readonly _description = (description?: string) => {
    return description ?? undefined
  }

  private static _buildMeta(title: string, image: string, description?: string): UseSeoMetaInput {
    return {
      title: title,
      description: description,
      ogTitle: title,
      ogDescription: description,
      ogImage: image,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: image
    }
  }
}
