import { getRequestURL } from 'h3'

const openApiRoute = '/_openapi.json'
const hiddenApiPaths = ['/api/health', '/api/__sitemap__/', '/api/stats/update_posthog_data']

// Only expose business API routes in the OpenAPI documentation (Nuxt internals and technical routes are hidden)
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event, response) => {
    if (getRequestURL(event).pathname !== openApiRoute) {
      return
    }

    const spec = response.body as { paths?: Record<string, unknown> } | undefined
    if (!spec?.paths) {
      return
    }

    spec.paths = Object.fromEntries(
      Object.entries(spec.paths).filter(
        ([path]) => path.startsWith('/api/') && !hiddenApiPaths.some((hiddenPath) => path.startsWith(hiddenPath))
      )
    )
  })
})
