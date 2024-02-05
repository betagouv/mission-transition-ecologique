import { useTracksStore } from '@/stores/tracks'
import { programsStore } from '@/stores/programs'
import { TrackId } from '@/types'
import { navigationStore } from '@/stores/navigation'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const resetTrackStore = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const tracks = useTracksStore()
  tracks.resetUsedTracks()
  next()
}
export const resetDetailProgram = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  navigationStore().resetQueries()
  programsStore().resetDetailResult()
  next()
}
export const setHelpAsTrackSeed = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const tracks = useTracksStore()
  tracks.setSeedTrack(TrackId.Help)
  next()
}
export const setResultsAsTrackSeed = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const tracks = useTracksStore()
  tracks.setSeedTrack(TrackId.Results)
  next()
}
