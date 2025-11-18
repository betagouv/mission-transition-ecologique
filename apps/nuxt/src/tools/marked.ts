import MarkdownIt from 'markdown-it'
import type { RenderRule } from 'markdown-it/lib/renderer'
import type Token from 'markdown-it/lib/token'
import type Renderer from 'markdown-it/lib/renderer'

export class Marked {
  static toHtml(markdown: string | undefined, withExtension = true, withMarkdownClass = true): string {
    if (!markdown) {
      return ''
    }

    const md = new MarkdownIt({ html: true })

    if (withExtension) {
      this._extend(md)
    }

    const parsed = md.render(markdown)
    return withMarkdownClass ? `<div class="markdown-spacing-reset">${parsed}</div>` : parsed
  }

  private static _extend(md: MarkdownIt): void {
    const defaultLinkOpen: RenderRule =
      md.renderer.rules.link_open ??
      ((tokens: Token[], idx: number, options: MarkdownIt.Options, env: Record<string, unknown>, self: Renderer): string => {
        return self.renderToken(tokens, idx, options)
      })

    md.renderer.rules.link_open = (
      tokens: Token[],
      idx: number,
      options: MarkdownIt.Options,
      env: Record<string, unknown>,
      self: Renderer
    ): string => {
      const token = tokens[idx]
      const hrefAttr = token.attrs?.find((attr) => attr[0] === 'href')
      const href = hrefAttr?.[1]

      if (href) {
        const local = Marked.isLocalLink(href)
        token.attrSet('target', '_blank')
        if (!local) {
          token.attrSet('rel', 'noopener external')
        }
      }

      return defaultLinkOpen(tokens, idx, options, env, self)
    }
  }

  public static isLocalLink(href: string): boolean {
    const url = this._getUrl(href)

    if (url) {
      const config = useRuntimeConfig()

      return (
        [config.public.siteUrl, 'https://preprod.mission-transition-ecologique.incubateur.net', 'http://localhost:4242'].includes(
          url.origin
        ) || href.startsWith('https://tee-preprod-pr')
      )
    }

    return href.startsWith('/')
  }

  private static _getUrl(href: string): URL | undefined {
    try {
      return new URL(href)
    } catch {
      return undefined
    }
  }
}
