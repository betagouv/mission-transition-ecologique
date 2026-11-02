export class LinkValidator {
  // A scheme, a "www." prefix, an IPv4 address or a domain name ("phishing.example", "bit.ly/x")
  private static readonly _linkPattern =
    /(\b[a-z][a-z\d+.-]*:\/\/|\bwww\.|\b\d{1,3}(\.\d{1,3}){3}\b|[\p{L}\d-]{2,}\.\p{L}{2,24}(?![\p{L}\d-]))/iu

  static readonly containsLink = (text: string | undefined): boolean => {
    if (text === undefined) {
      return false
    }

    return this._linkPattern.test(text)
  }

  static readonly validateWithoutLink = (text: string | undefined): boolean => {
    return text !== undefined && text.trim() !== '' && !this.containsLink(text)
  }

  static readonly isHttpUrl = (value: string): boolean => {
    const url = this._parse(value)

    return url !== undefined && ['http:', 'https:'].includes(url.protocol)
  }

  static readonly hasAllowedHost = (value: string, allowedHosts: string[]): boolean => {
    const url = this._parse(value)
    if (url === undefined) {
      return false
    }

    return allowedHosts.map((host) => host.toLowerCase()).includes(url.host.toLowerCase())
  }

  private static _parse(value: string): URL | undefined {
    try {
      return new URL(value)
    } catch {
      return undefined
    }
  }
}
