import { H3Event, getRequestURL } from 'h3'
import { LinkDetector, Opportunity } from '@tee/common'

export class OpportunityLinkHosts {
  // The custom project form always links to the production catalog
  static readonly productionHost = 'mission-transition-ecologique.beta.gouv.fr'

  // Partner sites allowed to send their own pages as catalog link (AGIR test environment)
  static readonly partnerHosts = ['rec-agir.direct.horsprod.ademe-scw.fr']

  // The Host header is used for routing by Cloudflare and Scalingo, unlike X-Forwarded-Host which any client can set
  static requestHost(event: H3Event): string {
    return getRequestURL(event).host
  }

  static allowedHosts(requestHost: string, siteUrl: string | undefined): string[] {
    const hosts = [this.productionHost, ...this.partnerHosts, requestHost]
    if (siteUrl && LinkDetector.isHttpUrl(siteUrl)) {
      hosts.push(new URL(siteUrl).host)
    }

    return hosts
  }

  // linkToCatalog is the only link we use: it is sent to Place des Entreprises and read by the advisors
  static invalidLinks(opportunity: Opportunity, allowedHosts: string[]): string[] {
    const link: string | undefined = opportunity.linkToCatalog
    if (link === undefined || !LinkDetector.hasAllowedHost(link, allowedHosts)) {
      return ['linkToCatalog']
    }

    return []
  }
}
