import { defineEventHandler } from 'h3'
import { Monitor } from '@tee/backend-ddd'
import { PosthogUpdater } from '@tee/data/server'

export default defineEventHandler(async () => {
  try {
    const updater = PosthogUpdater.getInstance()
    const res = await updater.updatePosthogData()
    return { message: res }
  } catch (error) {
    Monitor.error('Error during the PostHog data update', { error })
    throw createError({
      statusCode: 500,
      statusMessage: `Server internal error during the data update to posthog`
    })
  }
})
