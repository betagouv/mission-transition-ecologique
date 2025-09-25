import { marked, Tokens } from 'marked'

export class MarkedUrl {
  private _urls: string[] = []

  constructor(private _markdown: string) {}

  get(): string[] {
    const tokens = marked.lexer(this._markdown)

    this._extractUrls(tokens)

    return this._urls
  }

  getExternal(): string[] {
    const urls = this.get()
    return urls.filter((url) => {
      return /^https?:\/\//i.test(url)
    })
  }

  private _addUrl(href: string) {
    if (href && !this._urls.includes(href)) {
      this._urls.push(href)
    }
  }

  private _extractUrls = (tokenList: Tokens.Generic[]): void => {
    for (const token of tokenList) {
      if (token.type === 'link' && (token as Tokens.Link).href) {
        const href = (token as Tokens.Link).href
        if (href && !this._urls.includes(href)) {
          this._addUrl(href)
        }
      }

      if (token.type === 'image' && (token as Tokens.Image).href) {
        const href = (token as Tokens.Image).href
        this._addUrl(href)
      }

      if ('tokens' in token && Array.isArray(token.tokens)) {
        this._extractUrls(token.tokens)
      }

      if (token.type === 'list' && 'items' in token) {
        const listToken = token as Tokens.List
        for (const item of listToken.items) {
          if (item.tokens) {
            this._extractUrls(item.tokens)
          }
        }
      }

      if (token.type === 'table' && 'rows' in token) {
        const tableToken = token as Tokens.Table
        for (const row of tableToken.rows) {
          for (const cell of row) {
            if (cell.tokens) {
              this._extractUrls(cell.tokens)
            }
          }
        }
      }
    }
  }
}
