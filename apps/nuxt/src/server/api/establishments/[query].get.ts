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
