import { RouteName } from '@/types'

export default defineNuxtRouteMiddleware((to) => {
  if (!useUsedTrackStore().hasUsedTracks()) {
    return navigateTo(
      to.name === RouteName.ProgramResultDetail
        ? { name: RouteName.CatalogProgramDetail, params: { programId: to.params.programId } }
        : { name: RouteName.QuestionnaireStart }
    )
  }
})
