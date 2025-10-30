import { Monitor, StatisticsService, statQueryParamsSchema } from '@tee/backend-ddd'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const statsQuery = await getValidatedQuery(event, statQueryParamsSchema.parse)

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
