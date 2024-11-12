import { defineEventHandler } from 'h3'
import { EstablishmentService, Monitor, EstablishmentNotFoundError } from '@tee/backend-ddd'
import { z } from 'zod'

const querySchema = z.object({
  query: z.string()
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, querySchema.parse)
  const establishmentResult = await new EstablishmentService().search(params.query)

  if (establishmentResult.isErr) {
    const err = establishmentResult.error
    Monitor.error('Error in getEstablishmentBySiret', { query: params, error: err })

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
