import { opportunityBodySchema } from '@tee/common'
import { defineEventHandler } from 'h3'
import { Monitor, OpportunityService, ServiceNotFoundError } from '@tee/backend-ddd'

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
      422: {
        description: 'Body invalide.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      500: {
        description: "Erreur lors de l'enregistrement de la demande.",
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      }
    }
  }
})

export default defineEventHandler(async (event) => {
  const opportunityBody = await readValidatedBody(event, opportunityBodySchema.safeParse)

  if (opportunityBody.error) {
    Monitor.error('Error in opportunity validation', { error: opportunityBody.error })
    throw createError({
      statusCode: 422,
      statusMessage: opportunityBody.error.message
    })
  }

  const opportunityResult = await new OpportunityService().createOpportunity(opportunityBody.data.opportunity, opportunityBody.data.optIn)

  if (opportunityResult.isErr) {
    Monitor.error('Error in createOpportunity', { query: opportunityBody.data, error: opportunityResult.error })
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
