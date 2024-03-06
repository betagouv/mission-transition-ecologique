import { useProgramStore } from '@/stores/program'
import { RouteName } from '@/types/routeType'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'

export default class Hook {
  static readonly resetTrackStore = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    useUsedTrackStore().resetUsedTracks()
    next()
  }

  static readonly resetQueries = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    useNavigationStore().resetQueries()
    next()
  }

  static readonly startQuestionnaire = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    useUsedTrackStore().resetUsedTracks()
    next()
  }
  static readonly hasUsedTracks = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (useUsedTrackStore().usedTracks.length) {
      next()
    } else {
      next(
        to.name === RouteName.QuestionnaireResultDetail
          ? { name: RouteName.CatalogDetail, params: { programId: to.params.programId } }
          : { name: RouteName.QuestionnaireStart }
      )
    }
  }

  static readonly hasProgram = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.params.programId && useProgramStore().hasProgramById(to.params.programId as string)) {
      next()
    } else {
      next(to.name === RouteName.QuestionnaireResultDetail ? { name: RouteName.QuestionnaireStart } : { name: RouteName.Homepage })
    }
  }
}
