export default defineNuxtRouteMiddleware(() => {
  useUsedTrackStore().resetUsedTracks()
  return
})
