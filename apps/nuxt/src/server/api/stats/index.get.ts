import { Monitor, StatisticsService, statQueryParamsSchema } from '@tee/backend-ddd'
import { defineEventHandler } from 'h3'

defineRouteMeta({
  openAPI: {
    tags: ['Statistiques'],
    summary: "Statistiques d'usage",
    description: "Renvoie l'indicateur principal du service (nombre d'entreprises bénéficiaires, issu de Metabase), découpé par période.",
    parameters: [
      {
        name: 'periodicity',
        in: 'query',
        required: false,
        description: 'Découpage des statistiques par période.',
        schema: { type: 'string', enum: ['day', 'week', 'month', 'year'], default: 'month' }
      },
      {
        name: 'since',
        in: 'query',
        required: false,
        description:
          'Nombre de périodes à remonter. Par défaut, le numéro du mois en cours (soit depuis janvier en périodicité mensuelle).',
        schema: { type: 'integer', minimum: 0 }
      },
      {
        name: 'to',
        in: 'query',
        required: false,
        description: 'Date de fin de la période. Par défaut, la veille.',
        schema: { type: 'string', format: 'date' }
      }
    ],
    responses: {
      200: {
        description: 'Statistiques demandées.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                description: { type: 'string', description: "Libellé de l'indicateur." },
                stats: {
                  type: 'array',
                  items: { type: 'object', properties: { value: { type: 'number' }, date: { type: 'string' } } }
                }
              }
            }
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: {
        description: 'Erreur lors de la récupération des statistiques.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      }
    }
  }
})

export default defineEventHandler(async (event) => {
  // Validated outside the try block so that invalid query parameters result in a 400 instead of a 500
  const statsQuery = await getValidatedQuery(event, statQueryParamsSchema.parse)

  try {
    return await new StatisticsService().getNorthStarStats(statsQuery)
  } catch (error: any) {
    Monitor.error('Error in /api/stats', { error })
    throw createError({
      statusCode: 500,
      statusMessage: `Server internal error`,
      message: error.message
    })
  }
})
