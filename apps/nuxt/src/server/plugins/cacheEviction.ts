import { hash } from 'ohash'

/**
 * Proactive SWR cache eviction plugin
 *
 * Problem: Nitro's SWR mechanism stores rendered HTML per unique URL in an
 * unbounded in-memory Map. When `swr: true/number` is used in routeRules,
 * the underlying storage driver never receives a TTL (Nitro only checks TTL
 * internally on read). Unique URLs that are visited once and never revisited
 * accumulate indefinitely → OOM crash in production.
 *
 * Strategy: differentiated eviction based on whether the URL has query params.
 * - Parameterized pages (siret/effectif personalised content): evict after MAX_CACHE_AGE_PARAM_MS
 * - Non-parameterized pages (default content, only changes on deploy): kept until process restart
 *
 * Parameterized requests are tracked via a Nitro request hook. The URL hash computed
 * here mirrors Nitro's internal cache key formula: ohash.hash(fullUrl), where
 * fullUrl = event.node.req.originalUrl || event.node.req.url || event.path.
 * This lets us match tracked hashes against the URLHASH segment in
 * "nitro:handlers:[handlerHash]:[pathname16].[URLHASH].json" keys.
 */

const EVICTION_INTERVAL_MS = 5 * 60 * 1000 // run every 5 minutes
const MAX_CACHE_AGE_PARAM_MS = 60 * 60 * 1000 // 1 hour for parameterized pages

// Routes where SWR is active and differentiated eviction applies
const _SWR_ROUTE_PREFIXES = ['/aides-entreprise', '/projets-entreprise', '/iframe']

// Tracks ohash.hash(fullUrl) for requests that carried query parameters.
// Hashes match the URLHASH segment embedded in Nitro SWR cache keys:
//   "nitro:handlers:[handlerHash]:[pathname16].[URLHASH].json"
const _parameterizedUrlHashes = new Set<string>()

function _isSWRRoute(pathname: string): boolean {
  return _SWR_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'))
}

function _extractUrlHash(key: string): string | null {
  // Cache key format: nitro:handlers:[handlerHash]:[pathname16].[urlHash].json
  const match = key.match(/\.([^.]+)\.json$/)
  return match ? match[1] : null
}

export default defineNitroPlugin((nitroApp) => {
  // Record URL hashes for parameterized requests to SWR routes.
  // Uses the same hash formula as Nitro: ohash.hash(event.node.req.originalUrl || ...)
  nitroApp.hooks.hook('request', (event) => {
    const rawPath = event.node.req.originalUrl || event.node.req.url || event.path || ''
    const qIndex = rawPath.indexOf('?')
    if (qIndex === -1) {
      return
    }

    const pathname = rawPath.slice(0, qIndex)
    if (!_isSWRRoute(pathname)) {
      return
    }

    _parameterizedUrlHashes.add(hash(rawPath))
  })

  const intervalId = setInterval(async () => {
    try {
      // Route-level SWR cache uses the root storage with 'nitro:handlers:' prefix keys.
      // (Confirmed from built Nitro source: useStorage().setItem(cacheKey) where cacheKey = "nitro:handlers:...")
      const storage = useStorage()
      const keys = await storage.getKeys('nitro:handlers')
      let removed = 0

      for (const key of keys) {
        const urlHash = _extractUrlHash(key)
        if (!urlHash || !_parameterizedUrlHashes.has(urlHash)) {
          // Non-parameterized pages: keep cached until process restart (= next deploy)
          continue
        }

        const entry = await storage.getItem<{ mtime?: number }>(key)
        if (entry?.mtime && Date.now() - entry.mtime > MAX_CACHE_AGE_PARAM_MS) {
          await storage.removeItem(key)
          removed++
        }
      }

      if (removed > 0) {
        console.log(`[cache-eviction] Removed ${removed} expired parameterized SWR cache entries`)
      }
    } catch (error) {
      console.error('[cache-eviction] Error during cache eviction:', error)
    }
  }, EVICTION_INTERVAL_MS)

  // Don't prevent the process from exiting (e.g. during build/prerender)
  intervalId.unref()

  // Clean up interval on server shutdown
  process.once('SIGTERM', () => clearInterval(intervalId))
  process.once('SIGINT', () => clearInterval(intervalId))
})
