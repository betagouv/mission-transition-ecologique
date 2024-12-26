export default defineNuxtRouteMiddleware(() => {
  useUsedTrackStore().resetUsedTracks()
})
