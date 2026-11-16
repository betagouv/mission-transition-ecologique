export class HtmlTagDetector {
  // An opening or closing tag, a comment, a doctype or a processing instruction: "<" directly followed by a letter, "/", "!" or "?"
  // A "<" followed by a space or a digit ("< 50 salariés") is not a tag for browsers and stays allowed
  private static readonly _tagPattern = /<[a-z/!?]/i

  static readonly containsHtmlTag = (text: string | undefined): boolean => {
    if (text === undefined) {
      return false
    }

    return this._tagPattern.test(text)
  }
}
