// @vitest-environment node
import { IncomingMessage, ServerResponse } from 'node:http'
import { Socket } from 'node:net'
import { createEvent } from 'h3'
import { describe, expect, it } from 'vitest'
import { Opportunity, OpportunityType } from '@tee/common'
import { OpportunityLinkHosts } from './opportunityLinkHosts'

const eventWithHeaders = (headers: Record<string, string>) => {
  const req = new IncomingMessage(new Socket())
  req.url = '/api/opportunities'
  req.method = 'POST'
  req.headers = headers

  return createEvent(req, new ServerResponse(req))
}

const opportunity = (linkToCatalog: string | undefined): Opportunity => ({
  type: OpportunityType.Program,
  id: 'accelerateur-decarbonation',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean@example.fr',
  phoneNumber: '0605040302',
  companySiret: '83014132100034',
  message: 'Bonjour',
  // Cast: the API still receives a missing catalog link from clients that do not follow the schema
  linkToCatalog: linkToCatalog as string
})

describe('OpportunityLinkHosts', () => {
  const reviewAppHost = 'tee-preprod-pr2692.osc-fr1.scalingo.io'

  it('uses the Host header, port included', () => {
    expect(OpportunityLinkHosts.requestHost(eventWithHeaders({ host: 'localhost:4242' }))).toBe('localhost:4242')
  })

  it('ignores the X-Forwarded-Host header', () => {
    const event = eventWithHeaders({ host: reviewAppHost, 'x-forwarded-host': 'phishing.example' })

    expect(OpportunityLinkHosts.requestHost(event)).toBe(reviewAppHost)
  })

  it('allows the production host, the request host and the site url host', () => {
    expect(OpportunityLinkHosts.allowedHosts(reviewAppHost, 'https://preprod.example.fr')).toEqual([
      OpportunityLinkHosts.productionHost,
      reviewAppHost,
      'preprod.example.fr'
    ])
  })

  it.each([[undefined], [''], ['not an url']])('ignores an invalid site url (%s)', (siteUrl) => {
    expect(OpportunityLinkHosts.allowedHosts(reviewAppHost, siteUrl)).toEqual([OpportunityLinkHosts.productionHost, reviewAppHost])
  })

  it.each([[`https://${reviewAppHost}/aides-entreprise/x`], [`https://${OpportunityLinkHosts.productionHost}/custom`]])(
    'accepts a catalog link on an allowed host (%s)',
    (linkToCatalog) => {
      const allowedHosts = OpportunityLinkHosts.allowedHosts(reviewAppHost, undefined)

      expect(OpportunityLinkHosts.invalidLinks(opportunity(linkToCatalog), allowedHosts)).toEqual([])
    }
  )

  it.each([['https://phishing.example/x'], ['https://tee-preprod-pr9999.osc-fr1.scalingo.io/x'], [undefined]])(
    'rejects the catalog link %s',
    (linkToCatalog) => {
      const allowedHosts = OpportunityLinkHosts.allowedHosts(reviewAppHost, undefined)

      expect(OpportunityLinkHosts.invalidLinks(opportunity(linkToCatalog), allowedHosts)).toEqual(['linkToCatalog'])
    }
  )
})
