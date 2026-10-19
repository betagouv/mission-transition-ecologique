import { defineEventHandler, H3Event } from 'h3'
import { Monitor, EstablishmentService } from '@tee/backend-ddd'
import { z } from 'zod'
import { CacheKeyBuilder } from '~/server/utils/CacheKeyBuilder'

const nafSearchQuerySchema = z.object({
  searchTerm: z.string().optional().default('')
})

defineRouteMeta({
  openAPI: {
    tags: ['Entreprises'],
    summary: 'Rechercher une activité (code NAF)',
    description: "Recherche des activités dans la nomenclature NAF à partir d'un code ou d'un libellé.",
    parameters: [
      {
        name: 'searchTerm',
        in: 'query',
        required: false,
        description: 'Code ou libellé recherché.',
        schema: { type: 'string', default: '' }
      }
    ],
    responses: {
      200: {
        description: 'Activités trouvées.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  codeNAF: { type: 'string' },
                  codeNAF1: { type: 'string', description: 'Section NAF (lettre).' },
                  secteur: { type: 'string' }
                }
              }
            }
          }
        }
      },
      500: {
        description: 'Erreur lors de la recherche.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      }
    }
  }
})

export default defineEventHandler(async (event: H3Event) => {
  const searchTerm = await getValidatedQuery(event, nafSearchQuerySchema.parse)

  return searchNaf(searchTerm.searchTerm)
  // return await _searchNafCached(event, searchTerm.searchTerm)
})

const searchNaf = (searchTerm: string) => {
  const activitiesResult = new EstablishmentService().searchNAF(searchTerm)

  if (activitiesResult.isErr) {
    Monitor.error('Error in searchActivities', { searchTerm, error: activitiesResult.error })
    throw createError({
      statusCode: 500,
      statusMessage: activitiesResult.error.message
    })
  }

  return activitiesResult.value
}

const _searchNafCached = cachedFunction(
  async (event: H3Event, searchTerm) => {
    return searchNaf(searchTerm)
  },
  {
    name: 'nafSearch',
    getKey: (event: H3Event) => {
      return CacheKeyBuilder.fromEvent(event)
    },
    maxAge: CacheKeyBuilder.MAX_AGE
  }
)
