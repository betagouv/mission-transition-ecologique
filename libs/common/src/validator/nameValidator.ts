import { LinkDetector } from './linkDetector'
import { OpportunityFieldMaxLength } from '../opportunity/opportunityFieldMaxLength'

export class NameValidator {
  static readonly maxLength = Math.max(OpportunityFieldMaxLength.firstName, OpportunityFieldMaxLength.lastName)

  // Letters (accents included), spaces, apostrophes, dots and hyphens, including the typographic hyphens
  // and en dash (U+2010 to U+2013) that come from copy-paste
  private static readonly _namePattern = /^\p{L}[\p{L}\p{M} .'\u2019\u2010-\u2013-]*$/u

  // Non-breaking and other unicode spaces (copy-paste from Word or Outlook) become simple spaces
  static readonly normalize = (name: string): string => {
    return name.replace(/\s+/g, ' ').trim()
  }

  static readonly validate = (name: string | undefined): boolean => {
    if (name === undefined || name.length > this.maxLength * 2) {
      return false
    }

    const normalizedName = this.normalize(name)

    return normalizedName.length <= this.maxLength && this._namePattern.test(normalizedName) && !LinkDetector.containsLink(normalizedName)
  }
}
