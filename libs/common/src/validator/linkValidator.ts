export class LinkValidator {
  // Detected links:
  // - any scheme followed by "//" ("https://", "file://", "smb://")
  // - schemes usable without "//" ("search-ms:", "ms-msdt:", "javascript:", "file:C:\")
  // - Windows UNC paths ("\\server\share"), clickable in Outlook
  // - "www." prefixes, IPv4 addresses and domain names, including unicode dots ("phishing。example")
  private static readonly _linkPattern = new RegExp(
    [
      String.raw`\b[a-z][a-z\d+.-]*:\/\/`,
      String.raw`\b(?:file|smb|nfs|javascript|vbscript|data|shell|search|search-ms|ms-[a-z\d-]+):`,
      String.raw`\\\\[^\s\\]+`,
      String.raw`\bwww[.\u3002\uFF0E\uFF61]`,
      String.raw`\b\d{1,3}(?:[.\u3002\uFF0E\uFF61]\d{1,3}){3}\b`,
      String.raw`[\p{L}\d-]{2,}[.\u3002\uFF0E\uFF61]\p{L}{2,24}(?![\p{L}\d-])`
    ].join('|'),
    'iu'
  )

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
