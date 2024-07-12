import { marked, Tokens } from 'marked'
import { MarkedExtension } from 'marked/lib/marked'

export class Marked {
  static toHtml(markdown: string, withExtension = true): string {
    if (withExtension) {
      marked.use(this._extension())
    }

    return marked.parse(markdown) as string
  }

  private static _extension = (): MarkedExtension => {
    return {
      useNewRenderer: true,
      renderer: {
        link(token: Tokens.Link) {
          const text = this.parser.parseInline(token.tokens)
          if (token.href) {
            return `${text}`
          }
          const localLink = token.href.startsWith(`${location.protocol}//${location.hostname}`)
          const target = localLink ? '' : ' target="_blank" rel="noreferrer noopener nofollow"'
          return `<a href="${token.href}"${target}>${text}</a>`
        }
      }
    }
  }
}
