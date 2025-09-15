import { UseSeoMetaInput } from '@unhead/vue'

export class MetaSeo {
  private static readonly _defaultTitle = 'Transition écologique des entreprises : plus de 160 aides disponibles'
  private static readonly _defaultImage = '/images/TEE-social-network-sharing.webp'
  public static readonly defaultDescription =
    'Accédez aux bonnes aides pour la transition écologique de votre entreprise. Subventions, dispositifs et accompagnements pour TPE et PME.'
  public static readonly descriptionWebsite =
    'Service public en ligne pour accompagner les entreprises dans leur transition écologique en facilitant l’accès aux aides, subventions et dispositifs adaptés.'

  static readonly get = (title?: string, description?: string): UseSeoMetaInput => {
    return this._buildMeta(this.title(title), this._defaultImage, this._description(description))
  }

  static readonly default = () => {
    return this._buildMeta(this.title(), this._defaultImage, this.defaultDescription)
  }

  public static readonly title = (title?: string) => {
    return `${title || this._defaultTitle}`
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
