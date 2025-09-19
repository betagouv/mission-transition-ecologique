import { marked, Tokens } from 'marked'

export class MarkedUrl {
  private _urls: string[] = []

  constructor(private _markdown: string) {}

  get(): string[] {
    const tokens = marked.lexer(this._markdown)

    this._extractUrls(tokens)

    return this._urls
  }

  private _addUrl(href: string) {
    if (href && !this._urls.includes(href)) {
      this._urls.push(href)
    }
  }

  private _extractUrls = (tokenList: Tokens.Generic[]): string[] => {
    const urls: string[] = []

    for (const token of tokenList) {
      console.log(token)
      // Si c'est un token de lien, ajouter l'URL
      if (token.type === 'link' && (token as Tokens.Link).href) {
        const href = (token as Tokens.Link).href
        if (href && !urls.includes(href)) {
          this._addUrl(href)
        }
      }

      // Si c'est un token d'image, ajouter l'URL de l'image
      if (token.type === 'image' && (token as Tokens.Image).href) {
        const href = (token as Tokens.Image).href
        this._addUrl(href)
      }

      // Parcourir récursivement les tokens imbriqués
      if ('tokens' in token && Array.isArray(token.tokens)) {
        this._extractUrls(token.tokens)
      }

      // Pour les listes, parcourir les éléments
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

    return urls
  }

  getExternal(): string[] {
    const urls = this.get()
    return urls.filter((url) => {
      return /^https?:\/\//i.test(url)
    })
  }
}
