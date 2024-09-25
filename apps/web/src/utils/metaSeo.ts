export class MetaSeo {
  private static readonly _baseTitle = 'Transition écologique des TPE & PME'
  private static readonly _defaultTitle = 'Transition écologique - Aides et financements TPE & PME'
  private static readonly _defaultImage = '/images/TEE-preview-image-529-by-298.png'
  private static readonly _defaultDescription =
    'Service public pour les entreprises : Accédez simplement aux aides, accompagnements et financements pour réduire votre impact environnemental.'

  static readonly get = (title?: string, description?: string, image?: string) => {
    return {
      title: this._title(title),
      description: this._description(description),
      ogTitle: this._title(title),
      ogDescription: this._description(description),
      ogImage: this._image(image),
      twitterTitle: this._title(title),
      twitterDescription: this._description(description),
      twitterImage: this._image(image)
    }
  }

  static readonly default = () => {
    return {
      title: this._defaultTitle,
      description: this._defaultDescription,
      ogTitle: this._defaultTitle,
      ogDescription: this._defaultDescription,
      ogImage: this._image(),
      twitterTitle: this._defaultTitle,
      twitterDescription: this._defaultDescription,
      twitterImage: this._image()
    }
  }

  private static readonly _title = (title?: string) => {
    return title ? `${this._baseTitle} - ${title}` : this._defaultTitle
  }

  private static readonly _description = (description?: string) => {
    return description ?? undefined
  }

  private static readonly _image = (image?: string) => {
    image = image?.charAt(0) === '/' ? image : `/${image}`
    return location.origin + (image ?? this._defaultImage)
  }
}
