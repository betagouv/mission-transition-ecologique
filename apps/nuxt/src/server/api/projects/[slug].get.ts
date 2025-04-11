import { defineEventHandler, H3Event } from 'h3'
import { z } from 'zod'
import { Monitor, ProjectService } from '@tee/backend-ddd'

const projectSlugSchema = z.object({
  slug: z.string()
})

export default defineEventHandler(async (event) => {
  const routeParams = await getValidatedRouterParams(event, projectSlugSchema.parse)

  return projectCached(event, routeParams.slug)
})

const projectCached = cachedFunction(
  async (event: H3Event, slug: string) => {
    const projectService = new ProjectService()
    const redirect = projectService.getRedirect(slug)
    if (redirect) {
      console.log('/api/projects/' + redirect)
      return sendRedirect(event, '/api/projects/' + redirect, 301)
    }

    const project = projectService.getBySlug(slug)

    if (project === undefined) {
      const errorMessage = 'Project not found ' + slug
      Monitor.error('Error in ProjetFilter', { error: errorMessage })
      throw createError({
        statusCode: 500,
        statusMessage: errorMessage
      })
    }

    return project
  },
  {
    name: 'project',
    getKey: (event: H3Event, slug: string) => CacheKeyBuilder.formEvent(event, slug),
    maxAge: 60 * 60 * 24 // 24 hours
  }
)
