import { H3Event, getRequestURL } from 'h3'
import { LinkValidator, Opportunity } from '@tee/common'

export class OpportunityLinkHosts {
  // The custom project form always links to the production catalog
  private static readonly _productionHost = 'mission-transition-ecologique.beta.gouv.fr'

  static invalidLinks(event: H3Event, opportunity: Opportunity): string[] {
    const allowedHosts = this._allowedHosts(event)
    const links: Record<string, string | undefined> = {
      linkToPage: opportunity.linkToPage,
      linkToCatalog: opportunity.linkToCatalog
    }

    return Object.entries(links)
      .filter(([, link]) => link !== undefined && !LinkValidator.hasAllowedHost(link, allowedHosts))
      .map(([field]) => field)
  }

  private static _allowedHosts(event: H3Event): string[] {
    const hosts = [this._productionHost, getRequestURL(event, { xForwardedHost: true }).host]
    const siteUrl = useRuntimeConfig(event).public.siteUrl as string | undefined
    if (siteUrl && LinkValidator.isHttpUrl(siteUrl)) {
      hosts.push(new URL(siteUrl).host)
    }

    return hosts
  }
}
