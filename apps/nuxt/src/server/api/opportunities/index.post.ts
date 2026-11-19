import { opportunityBodySchema } from '@tee/common'
import { defineEventHandler, getRequestHeader, readRawBody, setResponseHeader } from 'h3'
import { Monitor, OpportunityService, OptInRequiredError, ServiceNotFoundError } from '@tee/backend-ddd'
import { JsonContentType } from '~/server/utils/jsonContentType'
import { OpportunityApiKey, OpportunityApiKeyStatus } from '~/server/utils/opportunityApiKey'
import { OpportunityLinkHosts } from '~/server/utils/opportunityLinkHosts'

defineRouteMeta({
  openAPI: {
    $global: {
      components: {
        securitySchemes: {
          partnerApiKey: {
            type: 'http',
            scheme: 'bearer',
            description:
              "Clé d'API remise aux partenaires qui appellent l'API depuis leur serveur. " +
              'Elle dispense du contrôle de domaine sur `linkToCatalog`.'
          }
        }
      }
    },
    tags: ['Opportunités'],
    summary: 'Déposer une demande de contact',
    description:
      "Enregistre la demande de contact d'une entreprise sur un dispositif ou un projet, puis la transmet aux opérateurs concernés.\n\n" +
      "Les partenaires qui appellent depuis leur serveur s'authentifient avec l'en-tête `Authorization: Bearer <clé>`. " +
      'Une clé valide dispense du contrôle de domaine sur `linkToCatalog` ; toutes les autres validations restent appliquées. ' +
      'Sans en-tête `Authorization`, la demande est traitée comme un appel du site.',
    parameters: [],
    // Empty requirement first: the key is optional, the site calls the route without it
    security: [{}, { partnerApiKey: [] }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/OpportunityBody' } } }
    },
    responses: {
      200: {
        description: 'Identifiant de la demande créée.',
        content: { 'application/json': { schema: { type: 'object' } } }
      },
      401: {
        description: "En-tête `Authorization` présent mais clé d'API invalide ou mal formée.",
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      404: {
        description: 'Demande non créée : aucun service ne peut la prendre en charge.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      413: {
        description: 'Body de plus de 100 Ko.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      415: {
        description: 'En-tête `Content-Type` absent ou différent de `application/json`.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      422: {
        description:
          'Body invalide (champ manquant, format incorrect, lien interdit, URL hors du domaine du site), ou consentement `optIn` absent. ' +
          "Une clé d'API valide dispense du contrôle des domaines autorisés sur `linkToPage` et `linkToCatalog`.",
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      500: {
        description: "Erreur lors de l'enregistrement de la demande.",
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      }
    }
  }
})

// A legitimate request weighs a few kilobytes: larger bodies are rejected before being validated.
// The size is measured on the body itself, as a chunked request has no Content-Length header.
// The xssValidator middleware of nuxt-security has already read the body at this point.
const maxBodySize = 100_000

export default defineEventHandler(async (event) => {
  // Checked first: a wrong key must not go through the other validations.
  // The key is not part of the logged data, and the Authorization header is removed from Sentry events (sentry.server.config.ts).
  const apiKeyCheck = OpportunityApiKey.check(getRequestHeader(event, 'authorization'))
  if (apiKeyCheck.status === OpportunityApiKeyStatus.Invalid) {
    // Warning without any detail on the key, like the other rejections: they must not flood the error alerts
    Monitor.warning('Opportunity rejected: invalid API key')
    // RFC 9110: a 401 response tells which authentication scheme is expected.
    // Set on the response, as the Nuxt error handler ignores the headers of createError.
    setResponseHeader(event, 'WWW-Authenticate', 'Bearer')
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid API key'
    })
  }

  // Name of the partner calling with a valid key, to know who made the call (never the key itself)
  const monitorTags = apiKeyCheck.partner ? { partner: apiKeyCheck.partner } : undefined

  // Without this check, a third-party site could make its visitors' browsers send requests (text/plain skips the CORS preflight)
  if (!JsonContentType.isJson(getRequestHeader(event, 'content-type'))) {
    throw createError({
      statusCode: 415,
      statusMessage: `Content-Type must be ${JsonContentType.mediaType}`
    })
  }

  const rawBody = await readRawBody(event, false)
  if (rawBody !== undefined && rawBody.length > maxBodySize) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Request body too large'
    })
  }

  const opportunityBody = await readValidatedBody(event, opportunityBodySchema.safeParse)

  if (opportunityBody.error) {
    // Warning: rejections are expected (bots, phishing attempts) and must not flood the error alerts
    Monitor.warning('Error in opportunity validation', { error: opportunityBody.error }, monitorTags)
    throw createError({
      statusCode: 422,
      statusMessage: opportunityBody.error.message
    })
  }

  // Partners calling with a valid key send links to their own domains
  if (apiKeyCheck.status !== OpportunityApiKeyStatus.Valid) {
    const requestHost = OpportunityLinkHosts.requestHost(event)
    const allowedHosts = OpportunityLinkHosts.allowedHosts(requestHost, useRuntimeConfig(event).public.siteUrl as string | undefined)
    const invalidLinks = OpportunityLinkHosts.invalidLinks(opportunityBody.data.opportunity, allowedHosts)
    if (invalidLinks.length > 0) {
      // No personal data: only what is needed to understand the rejection
      Monitor.warning('Opportunity rejected: link outside of the allowed hosts', { invalidLinks, allowedHosts })
      throw createError({
        statusCode: 422,
        statusMessage: `Links must point to the site domain: ${invalidLinks.join(', ')}`
      })
    }
  }

  const opportunityResult = await new OpportunityService().createOpportunity(
    opportunityBody.data.opportunity,
    opportunityBody.data.optIn,
    apiKeyCheck.partner
  )

  if (opportunityResult.isErr) {
    Monitor.error('Error in createOpportunity', { query: opportunityBody.data, error: opportunityResult.error }, monitorTags)
    if (opportunityResult.error instanceof OptInRequiredError) {
      throw createError({
        statusCode: 422,
        statusMessage: opportunityResult.error.message
      })
    }

    if (opportunityResult.error instanceof ServiceNotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: `Opportunity not created: ${opportunityResult.error.message}`
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Server internal error: ${opportunityResult.error.message}`
    })
  }

  return opportunityResult.value
})
