import MarkdownIt from 'markdown-it'
import type { RenderRule } from 'markdown-it/lib/renderer'
import type Token from 'markdown-it/lib/token'
import type Renderer from 'markdown-it/lib/renderer'

export class Marked {
  static toHtml(markdown: string | undefined, withExtension = true, withMarkdownClass = true): string {
    if (!markdown) {
      return ''
    }

    const md = new MarkdownIt({ html: true, linkify: true })

    if (withExtension) {
      this._configureRenderer(md)
    }

    const parsed = md.render(markdown)
    return withMarkdownClass ? `<div class="markdown-spacing-reset">${parsed}</div>` : parsed
  }

  private static _configureRenderer(md: MarkdownIt): void {
    const defaultLinkOpenRenderer = this._getDefaultLinkOpenRenderer(md)
    md.renderer.rules.link_open = this._createLinkOpenRenderer(defaultLinkOpenRenderer)
  }

  private static _getDefaultLinkOpenRenderer(md: MarkdownIt): RenderRule {
    return (
      md.renderer.rules.link_open ??
      ((tokens: Token[], idx: number, options: MarkdownIt.Options, env: Record<string, unknown>, self: Renderer): string => {
        return self.renderToken(tokens, idx, options)
      })
    )
  }

  private static _createLinkOpenRenderer(defaultRenderer: RenderRule): RenderRule {
    return (tokens: Token[], idx: number, options: MarkdownIt.Options, env: Record<string, unknown>, self: Renderer): string => {
      const token = tokens[idx]
      const href = this._getHrefFromToken(token)

      if (href) {
        const isLocal = this.isLocalLink(href)
        token.attrSet('target', '_blank')
        if (!isLocal) {
          token.attrSet('rel', 'noopener external')
        }
      }

      return defaultRenderer(tokens, idx, options, env, self)
    }
  }

  private static _getHrefFromToken(token: Token): string | undefined {
    const hrefAttr = token.attrs?.find((attr: [string, string]) => attr[0] === 'href')
    return hrefAttr?.[1]
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
