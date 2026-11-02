import { LinkValidator } from './linkValidator'

export class NameValidator {
  static readonly maxLength = 100

  // Letters (accents included), spaces, apostrophes, dots and hyphens, including the typographic hyphens
  // and en dash (U+2010 to U+2013) that come from copy-paste
  private static readonly _namePattern = /^\p{L}[\p{L}\p{M} .'’‐-–-]*$/u

  static readonly validate = (name: string | undefined): boolean => {
    if (name === undefined) {
      return false
    }

    const trimmedName = name.trim()

    return trimmedName.length <= this.maxLength && this._namePattern.test(trimmedName) && !LinkValidator.containsLink(trimmedName)
  }
}
