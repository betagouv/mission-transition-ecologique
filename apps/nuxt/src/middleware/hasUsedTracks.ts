import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware((to) => {
  if (!useUsedTrackStore().hasUsedTracks()) {
    if (to.name === RouteName.ProgramResultDetail) {
      return navigateTo({ name: RouteName.CatalogProgramDetail, params: { programId: to.params.programId } })
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found'
      })
    }
  }
})
