import { ProjectFilterQuery, serverProjectFilterQuerySchema } from '@tee/common'
import { defineEventHandler, H3Event } from 'h3'
import { Monitor, ProjectService } from '@tee/backend-ddd'

export default defineEventHandler(async (event) => {
  const queries = await getValidatedQuery(event, serverProjectFilterQuerySchema.parse)

  return projectsCached(event, queries)
})

const projectsCached = cachedFunction(
  async (event: H3Event, queries: ProjectFilterQuery) => {
    const projectResults = new ProjectService().getFiltered(queries)

    if (projectResults.isErr) {
      const err = projectResults.error
      Monitor.error('Error in ProjetFilter', { error: err })
      throw createError({
        statusCode: 500,
        statusMessage: projectResults.error.message
      })
    }

    return projectResults.value
  },
  {
    name: 'projects',
    getKey: (event: H3Event) => {
      return CacheKeyBuilder.formEvent(event)
    },
    maxAge: 60 * 60 * 24 // 24 hours
  }
)
