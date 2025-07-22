import { defineEventHandler, getQuery } from 'h3'
import { Monitor, StatisticsService } from '@tee/backend-ddd'
import { StatsPeriodicity } from '@tee/common'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    const periodicity = ['day', 'week', 'month', 'year'].includes(query.periodicity as StatsPeriodicity)
      ? (query.periodicity as StatsPeriodicity)
      : undefined
    const since = typeof query.since === 'string' ? query.since : undefined
    const to = typeof query.to === 'string' ? query.to : undefined

    const statsResult = await new StatisticsService().getNorthStarStats({ periodicity, since, to })

    return statsResult
  } catch (error: any) {
    Monitor.error('Error in /api/stats', { error })
    throw createError({
      statusCode: 500,
      statusMessage: `Server internal error: ${error.message}`
    })
  }
})
