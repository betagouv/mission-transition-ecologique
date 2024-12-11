import { defineEventHandler } from 'h3'
import { Monitor, ProjectService } from '@tee/backend-ddd'
import { z } from 'zod'

const projectSlugSchema = z.object({
  slug: z.string()
})

export default defineEventHandler(async (event) => {
  const routeParams = await getValidatedRouterParams(event, projectSlugSchema.parse)

  const project = new ProjectService().getBySlug(routeParams.slug)

  if (project === undefined) {
    const errorMessage = 'Project not found ' + routeParams.slug
    Monitor.error('Error in ProjetFilter', { error: errorMessage })
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage
    })
  }

  return project
})
