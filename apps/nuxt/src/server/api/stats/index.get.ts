import { defineEventHandler } from 'h3'
import { Monitor, StatisticsService } from '@tee/backend-ddd'
import { statQueryParamsSchema } from '@tee/backend-ddd'

export default defineEventHandler(async (event) => {
  try {
    const statsQuery = await getValidatedQuery(event, statQueryParamsSchema.parse)

    const statsResult = await new StatisticsService().getNorthStarStats(statsQuery)

    return statsResult
  } catch (error: any) {
    Monitor.error('Error in /api/stats', { error })
    throw createError({
      statusCode: 500,
      statusMessage: `Server internal error`,
      message: error.message
    })
  }
})
