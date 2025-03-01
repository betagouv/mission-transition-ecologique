import { TrackId } from '@/types'

export default defineNuxtRouteMiddleware((to) => {
  const track = useTrackStore().getTrack(to.params.trackId as TrackId)

  if (!track) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Track not Found'
    })
  }
})
