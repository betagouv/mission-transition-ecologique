import { defineEventHandler } from 'h3'
import { Monitor } from '@tee/backend-ddd'
import { StatisticsService } from '@tee/backend-ddd'

export default defineEventHandler(async () => {
  try {
    const iframeUrl = new StatisticsService().generateIframeUrl()
    return { iframeUrl }
  } catch (error) {
    Monitor.error('Error during the generation of the statistics iframe', { error })
    throw createError({
      statusCode: 500,
      statusMessage: `Server internal error while generating the statistics`
    })
  }
})
