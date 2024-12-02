import { defineEventHandler } from 'h3'
import { EstablishmentService, Monitor, EstablishmentNotFoundError } from '@tee/backend-ddd'
import { z } from 'zod'

const routeParamsSchema = z.object({
  query: z.string()
})
const queriesSchema = z.object({
  count: z.number().optional().default(3)
})

export default defineEventHandler(async (event) => {
  const routeParams = await getValidatedRouterParams(event, routeParamsSchema.parse)
  const queries = await getValidatedQuery(event, queriesSchema.parse)
  const establishmentResult = await new EstablishmentService().search(routeParams.query, queries.count)

  if (establishmentResult.isErr) {
    const err = establishmentResult.error
    Monitor.error('Error in getEstablishmentBySiret', { query: routeParams, error: err })

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
})
