import { defineEventHandler, EventHandlerRequest, H3Event } from 'h3'
import { Monitor, ProjectService } from '@tee/backend-ddd'
import { z } from 'zod'
import { CacheKeyBuilder } from '~/server/utils/CacheKeyBuilder'

const projectSlugSchema = z.object({
  slug: z.string()
})

export default defineEventHandler(async (event) => {
  const routeParams = await getValidatedRouterParams(event, projectSlugSchema.parse)

  return getProjectBySlug(event, routeParams.slug)
  // return await _getProjectBySlugCached(event, routeParams.slug)
})

const getProjectBySlug = (event: H3Event<EventHandlerRequest>, slug: string) => {
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
}

const _getProjectBySlugCached = cachedFunction(
  async (event: H3Event, slug: string) => {
    return getProjectBySlug(event, slug)
  },
  {
    name: 'project',
    getKey: (event: H3Event, slug: string) => CacheKeyBuilder.fromEvent(event, slug),
    maxAge: CacheKeyBuilder.MAX_AGE
  }
)
