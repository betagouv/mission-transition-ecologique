import { getRequestURL } from 'h3'

type OpenApiSpec = { paths?: Record<string, Record<string, { summary?: string }>> }

// Only expose documented API routes (with a `defineRouteMeta` summary): Nuxt internals and technical routes are hidden
export default defineNitroPlugin((nitroApp) => {
  // Same default as Nitro when `nitro.openAPI.route` is not configured
  const openApiRoute = useRuntimeConfig().nitro?.openAPI?.route || '/_openapi.json'

  nitroApp.hooks.hook('beforeResponse', (event, response) => {
    if (getRequestURL(event).pathname !== openApiRoute) {
      return
    }

    const spec = response.body as OpenApiSpec | undefined
    if (!spec?.paths) {
      return
    }

    spec.paths = Object.fromEntries(
      Object.entries(spec.paths).filter(([, operations]) => Object.values(operations).some((operation) => operation.summary))
    )
  })
})
