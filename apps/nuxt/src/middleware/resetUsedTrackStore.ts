export default defineNuxtRouteMiddleware(() => {
  useUsedTrackStore().resetUsedTracks(true)
})
