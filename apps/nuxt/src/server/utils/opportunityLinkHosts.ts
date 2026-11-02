import { H3Event, getRequestURL } from 'h3'
import { LinkDetector, Opportunity } from '@tee/common'

export class OpportunityLinkHosts {
  // The custom project form always links to the production catalog
  static readonly productionHost = 'mission-transition-ecologique.beta.gouv.fr'

  // The Host header is used for routing by Cloudflare and Scalingo, unlike X-Forwarded-Host which any client can set
  static requestHost(event: H3Event): string {
    return getRequestURL(event).host
  }

  static allowedHosts(requestHost: string, siteUrl: string | undefined): string[] {
    const hosts = [this.productionHost, requestHost]
    if (siteUrl && LinkDetector.isHttpUrl(siteUrl)) {
      hosts.push(new URL(siteUrl).host)
    }

    return hosts
  }

  static invalidLinks(opportunity: Opportunity, allowedHosts: string[]): string[] {
    const links: Record<string, string | undefined> = {
      linkToPage: opportunity.linkToPage,
      linkToCatalog: opportunity.linkToCatalog
    }

    return Object.entries(links)
      .filter(([, link]) => link === undefined || !LinkDetector.hasAllowedHost(link, allowedHosts))
      .map(([field]) => field)
  }
}
