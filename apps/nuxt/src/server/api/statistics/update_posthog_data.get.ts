import { defineEventHandler } from 'h3'
import { Monitor } from '@tee/backend-ddd'
import { PosthogUpdater } from '@tee/data'

export default defineEventHandler(async () => {
  try {
    const updater = PosthogUpdater.getInstance()
    await updater.updatePosthogData()
    return { message: 'PostHog data updated successfully' }
  } catch (error) {
    Monitor.error('Error during the PostHog data update', { error })
    throw createError({
      statusCode: 500,
      statusMessage: `Server internal error during the data update to posthog`
    })
  }
})
