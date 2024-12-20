import { defineEventHandler } from 'h3'
import { Monitor, StatisticsService } from '@tee/backend-ddd'

export default defineEventHandler(async () => {
  const statisticsResult = await new StatisticsService().get()

  if (statisticsResult.isErr) {
    Monitor.error('Error in get statistics', { error: statisticsResult.error })
    throw createError({
      statusCode: 500,
      statusMessage: `Server internal error: ${statisticsResult.error.message}`
    })
  }

  return statisticsResult.value
})
