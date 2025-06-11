import { marked, Tokens } from 'marked'
import { MarkedExtension } from 'marked/lib/marked'

export class Marked {
  static toHtml(markdown: string | undefined, withExtension = true): string {
    if (!markdown) {
      return ''
    }
    if (withExtension) {
      marked.use(this._extension())
    }

    const parsed = marked.parse(markdown) as string
    return `<div class="markdown-spacing-reset">${parsed}</div>`
  }

  private static _extension = (): MarkedExtension => {
    return {
      renderer: {
        link(token: Tokens.Link) {
          const text = this.parser.parseInline(token.tokens)
          if (token.href === undefined) {
            return `${text}`
          }
          // const localLink = token.href.startsWith(`${location.protocol}//${location.hostname}`) // disable because of SSR and not url with mission-transition-ecologique
          const localLink = false
          const target = localLink ? '' : ' target="_blank" rel="noopener external"'
          return `<a href="${token.href}"${target}>${text}</a>`
        }
      }
    }
  }
}
