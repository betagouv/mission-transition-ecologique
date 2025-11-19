import MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'

export class MarkedUrl {
  private _urls: string[] = []
  private readonly _md = new MarkdownIt({ html: true })

  constructor(private _markdown: string) {}

  get(): string[] {
    const tokens = this._md.parse(this._markdown)
    this._extractUrls(tokens)
    if (this._urls.length) {
      console.log(this._urls)
    }
    return this._urls
  }

  getExternal(): string[] {
    return this.get().filter((url) => /^https?:\/\//i.test(url))
  }

  private _addUrl(href: string) {
    if (href && !this._urls.includes(href)) {
      this._urls.push(href)
    }
  }

  private _extractUrls(tokens: Token[]): void {
    for (const token of tokens) {
      if (token.type === 'link_open') {
        const href = token.attrGet('href')
        if (href) {
          this._addUrl(href)
        }
      }

      if (token.type === 'image') {
        const src = token.attrGet('src')
        if (src) {
          this._addUrl(src)
        }
      }

      if (Array.isArray(token.children)) {
        this._extractUrls(token.children)
      }
    }
  }
}
