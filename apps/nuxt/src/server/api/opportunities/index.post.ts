import { opportunityBodySchema } from '@tee/common'
import { defineEventHandler, getRequestHeader } from 'h3'
import { Monitor, OpportunityService, OptInRequiredError, ServiceNotFoundError } from '@tee/backend-ddd'
import { OpportunityLinkHosts } from '~/server/utils/opportunityLinkHosts'

defineRouteMeta({
  openAPI: {
    tags: ['Opportunités'],
    summary: 'Déposer une demande de contact',
    description:
      "Enregistre la demande de contact d'une entreprise sur un dispositif ou un projet, puis la transmet aux opérateurs concernés.",
    parameters: [],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/OpportunityBody' } } }
    },
    responses: {
      200: {
        description: 'Identifiant de la demande créée.',
        content: { 'application/json': { schema: { type: 'object' } } }
      },
      404: {
        description: 'Demande non créée : aucun service ne peut la prendre en charge.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      413: {
        description: 'Body de plus de 100 Ko.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      422: {
        description:
          'Body invalide (champ manquant, format incorrect, lien interdit, URL hors du domaine du site), ou consentement `optIn` absent.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      500: {
        description: "Erreur lors de l'enregistrement de la demande.",
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      }
    }
  }
})

// A legitimate request weighs a few kilobytes: larger bodies are rejected before being parsed
const maxBodySize = 100_000

export default defineEventHandler(async (event) => {
  if (Number(getRequestHeader(event, 'content-length') ?? 0) > maxBodySize) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Request body too large'
    })
  }

  const opportunityBody = await readValidatedBody(event, opportunityBodySchema.safeParse)

  if (opportunityBody.error) {
    Monitor.error('Error in opportunity validation', { error: opportunityBody.error })
    throw createError({
      statusCode: 422,
      statusMessage: opportunityBody.error.message
    })
  }

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

  const opportunityResult = await new OpportunityService().createOpportunity(opportunityBody.data.opportunity, opportunityBody.data.optIn)

  if (opportunityResult.isErr) {
    Monitor.error('Error in createOpportunity', { query: opportunityBody.data, error: opportunityResult.error })
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
