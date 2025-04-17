import { defineEventHandler, H3Event } from 'h3'
import { Monitor, ProjectService } from '@tee/backend-ddd'
import { z } from 'zod'

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
      const queryString = getRequestURL(event).search
      const newUrl = `/api/projects/${redirect}${queryString}`
      return sendRedirect(event, newUrl, 301)
    }
    const project = projectService.getBySlug(slug)

    if (project === undefined) {
      Monitor.warning('Requested Project slug not found', { slug })
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found'
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
