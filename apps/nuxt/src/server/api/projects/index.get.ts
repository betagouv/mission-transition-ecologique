import { projectFilterQuerySchema } from '@tee/common'
import { defineEventHandler } from 'h3'
import { Monitor, ProjectService } from '@tee/backend-ddd'

export default defineEventHandler(async (event) => {
  const queries = await getValidatedQuery(event, projectFilterQuerySchema.parse)

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
})
