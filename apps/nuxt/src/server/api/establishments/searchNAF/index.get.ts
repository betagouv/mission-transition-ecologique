import { defineEventHandler, H3Event } from 'h3'
import { Monitor, EstablishmentService } from '@tee/backend-ddd'
import { z } from 'zod'

const nafSearchQuerySchema = z.object({
  searchTerm: z.string().optional().default('')
})

export default defineEventHandler(async (event: H3Event) => {
  const searchTerm = await getValidatedQuery(event, nafSearchQuerySchema.parse)
  return await searchNafCached(event, searchTerm.searchTerm)
})

const searchNafCached = cachedFunction(
  async (event: H3Event, searchTerm) => {
    const activitiesResult = new EstablishmentService().searchNAF(searchTerm)

    if (activitiesResult.isErr) {
      Monitor.error('Error in searchActivities', { searchTerm, error: activitiesResult.error })
      throw createError({
        statusCode: 500,
        statusMessage: activitiesResult.error.message
      })
    }

    return activitiesResult.value
  },
  {
    name: 'nafSearch',
    getKey: (event: H3Event) => {
      return CacheKeyBuilder.formEvent(event)
    },
    maxAge: 60 * 60 * 24 // 24 hours
  }
)
