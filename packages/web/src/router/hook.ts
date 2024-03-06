import { RouteName } from '@/types/routeType'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'

export default class Hook {
  static resetTrackStore = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    useUsedTrackStore().resetUsedTracks()
    next()
  }

  static resetQueries = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    useNavigationStore().resetQueries()
    next()
  }

  static startQuestionnaire = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    useUsedTrackStore().resetUsedTracks()
    next()
  }
  static hasUsedTracks = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (useUsedTrackStore().usedTracks.length) {
      next()
    } else {
      next({ name: RouteName.QuestionnaireStart })
    }
  }
}
