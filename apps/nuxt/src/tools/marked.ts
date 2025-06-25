import { marked, Tokens } from 'marked'
import { MarkedExtension } from 'marked/lib/marked'

export class Marked {
  static toHtml(markdown: string | undefined, withExtension = true, withMarkdownClass = true): string {
    if (!markdown) {
      return ''
    }
    if (withExtension) {
      marked.use(this._extension())
    }

    const parsed = marked.parse(markdown) as string
    return withMarkdownClass ? `<div class="markdown-spacing-reset">${parsed}</div>` : parsed
  }

  private static _extension = (): MarkedExtension => {
    return {
      renderer: {
        link(token: Tokens.Link) {
          const text = this.parser.parseInline(token.tokens)
          if (token.href === undefined) {
            return `${text}`
          }

          const config = useRuntimeConfig()
          const localLink = token.href.startsWith(config.public.siteUrl) // disable because of SSR and not url with mission-transition-ecologique
          const target = localLink ? ' target="_blank"' : ' target="_blank" rel="noopener external"'
          return `<a href="${token.href}"${target}>${text}</a>`
        }
      }
    }
  }
}
