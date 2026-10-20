import { defineEventHandler, H3Event } from 'h3'
import { EstablishmentService, Monitor, EstablishmentNotFoundError } from '@tee/backend-ddd'
import { z } from 'zod'
import { CacheKeyBuilder } from '~/server/utils/CacheKeyBuilder'

const routeParamsSchema = z.object({
  query: z.string()
})
const queriesSchema = z.object({
  count: z.coerce.number().optional().default(3)
})

defineRouteMeta({
  openAPI: {
    tags: ['Entreprises'],
    summary: 'Rechercher une entreprise',
    description: "Recherche des établissements par SIRET ou par nom, via l'API Recherche d'entreprises.",
    parameters: [
      { name: 'query', in: 'path', required: true, description: "SIRET ou nom de l'entreprise recherchée.", schema: { type: 'string' } },
      {
        name: 'count',
        in: 'query',
        required: false,
        description: "Nombre maximum d'établissements renvoyés.",
        schema: { type: 'integer', default: 3 }
      }
    ],
    responses: {
      200: {
        description: 'Établissements trouvés.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                establishments: { type: 'array', items: { type: 'object' } },
                resultCount: { type: 'integer', description: 'Nombre total de résultats.' }
              }
            }
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      404: {
        description: 'Aucun établissement trouvé.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      500: {
        description: "Erreur lors de l'appel à l'API Recherche d'entreprises.",
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      }
    }
  }
})

export default defineEventHandler(async (event) => {
  const routeParams = await getValidatedRouterParams(event, routeParamsSchema.parse)
  const queries = await getValidatedQuery(event, queriesSchema.parse)

  return await establishmentSearch(routeParams.query, queries.count)
  // return await _establishmentCached(event, routeParams.query, queries.count)
})

const establishmentSearch = async (query: string, count: number) => {
  const establishmentResult = await new EstablishmentService().search(query, count)
  if (establishmentResult.isErr) {
    const err = establishmentResult.error
    Monitor.error('Error in the establishement search', { query: query, error: err })

    if (err instanceof EstablishmentNotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Establishment not found'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Server internal error'
    })
  }

  return establishmentResult.value
}

const _establishmentCached = cachedFunction(
  async (event: H3Event, query: string, count: number) => {
    return await establishmentSearch(query, count)
  },
  {
    name: 'establishment',
    getKey: (event: H3Event, query: string, count: number) => CacheKeyBuilder.fromEvent(event, `${query}-${count}`),
    maxAge: CacheKeyBuilder.MAX_AGE
  }
)
