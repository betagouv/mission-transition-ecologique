import { tracksStore } from '@/stores/tracks'
import { programsStore } from '@/stores/programs'
import { TrackId } from '@/types'
import { navigationStore } from '@/stores/navigation'

export const resetTrackStore = async (to: any, from: any, next: any) => {
  // console.log('\nrouter > beforeEnter > resetTrackStore > from :', from)
  // console.log('router > beforeEnter > resetTrackStore > to :', to)
  const tracks = tracksStore()
  await tracks.resetUsedTracks()
  await next()
}
export const resetDetailProgram = async (to: any, from: any, next: any) => {
  navigationStore().resetQueries()
  programsStore().resetDetailResult()
  await next()
}
export const setHelpAsTrackSeed = async (to: any, from: any, next: any) => {
  // console.log('\nrouter > beforeEnter > setHelpAsTrackSeed > from :', from)
  // console.log('router > beforeEnter > setHelpAsTrackSeed > to :', to)
  const tracks = tracksStore()
  await tracks.setSeedTrack(TrackId.Help)
  // await tracks.addToUsedTracks('track_help', 'track_help')
  // next({ name: 'questionnaire' })
  await next()
}
export const setResultsAsTrackSeed = async (to: any, from: any, next: any) => {
  // console.log('\nrouter > beforeEnter > setResultsAsTrackSeed > from :', from)
  // console.log('router > beforeEnter > setResultsAsTrackSeed > to :', to)
  const tracks = tracksStore()
  await tracks.setSeedTrack(TrackId.Results)
  // await tracks.addToUsedTracks('track_results', 'track_results')
  // next({ name: 'catalog' })
  await next()
}
