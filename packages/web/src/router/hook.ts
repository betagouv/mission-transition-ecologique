import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const resetTrackStore = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  useUsedTrackStore().resetUsedTracks()
  next()
}
export const resetQueries = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  useNavigationStore().resetQueries()
  next()
}
export const startQuestionnaire = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  useUsedTrackStore().resetUsedTracks()
  next()
}
