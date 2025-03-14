import { UseSeoMetaInput } from '@unhead/vue'

export class MetaSeo {
  private static readonly _baseTitle = 'Transition écologique des TPE & PME'
  private static readonly _defaultTitle = 'Transition écologique - Aides et financements TPE & PME'
  private static readonly _defaultImage = '/images/TEE-preview-image-529-by-298.png'
  private static readonly _defaultDescription =
    'Service public pour les entreprises : Accédez simplement aux aides, accompagnements et financements pour réduire votre impact environnemental.'

  static readonly get = (title?: string, description?: string, image?: string): UseSeoMetaInput => {
    return this._buildMeta(this._title(title), this._image(image), this._description(description))
  }

  static readonly default = () => {
    return this._buildMeta(this._title(), this._image(), this._defaultDescription)
  }

  private static readonly _title = (title?: string) => {
    return title ? `${this._baseTitle} - ${title}` : this._defaultTitle
  }

  private static readonly _description = (description?: string) => {
    return description ?? undefined
  }

  private static readonly _image = (image?: string) => {
    if (!image) {
      return this._defaultImage
    }
    return image?.charAt(0) === '/' ? image : `/${image}`
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
