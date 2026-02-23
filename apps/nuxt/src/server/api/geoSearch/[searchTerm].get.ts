import { defineEventHandler, H3Event } from 'h3'
import { Monitor, GeoSearchService } from '@tee/backend-ddd'
import { z } from 'zod'
import { CacheKeyBuilder } from '~/server/utils/CacheKeyBuilder'

const geoSearchTermSchema = z.object({
  searchTerm: z.string()
})

export default defineEventHandler(async (event) => {
  const routeParams = await getValidatedRouterParams(event, geoSearchTermSchema.parse)

  return geoSearch(routeParams.searchTerm)
  // return await _geoSearchCached(event, routeParams.searchTerm)
})

const geoSearch = (searchTerm: string) => {
  const citiesResult = new GeoSearchService().searchCities(searchTerm)

  if (citiesResult.isErr) {
    const err = citiesResult.error
    Monitor.error('Error in searchCities', { searchTerm: searchTerm, error: err })
    throw createError({
      statusCode: 500,
      statusMessage: 'Server internal error'
    })
  }

  return citiesResult.value
}

const _geoSearchCached = cachedFunction(
  async (event: H3Event, searchTerm: string) => {
    return geoSearch(searchTerm)
  },
  {
    name: 'geosearch',
    getKey: (event: H3Event, searchTerm: string) => CacheKeyBuilder.fromEvent(event, searchTerm),
    maxAge: CacheKeyBuilder.MAX_AGE
  }
)
