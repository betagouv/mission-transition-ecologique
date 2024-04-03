<template>
  <div
    v-if="!usedTrackStore.currentIsFirst && track?.resume"
    class="fr-px-4v fr-px-md-0v fr-col-12"
  >
    <p class="fr-mb-0">
      {{ track.resume[Translation.lang] }}
      <!-- {{ injectValuesInString(track.resume[Translation.lang]) }} -->
    </p>
  </div>
</template>

<script setup lang="ts">
import { useUsedTrackStore } from '@/stores/usedTrack'
import type {
  Track //
  // FlatObject
} from '@/types'
import Translation from '@/utils/translation'

interface Props {
  track: Track
}
defineProps<Props>()

const usedTrackStore = useUsedTrackStore()

// const injectValuesInString = (str: string) => {
//   const userValues = usedTrackStore.usedTracksValuesSingleObject as FlatObject
//   const regex = /\{.+?\}/g
//   const matches = str.match(regex) || []
//   const params: Record<string, string> = {}
//   if (matches.length) {
//     matches.forEach((s: string) => {
//       const key = s.replace('{', '').replace('}', '')
//       params[key] = userValues[key].toString()
//     })
//   }
//   return Translation.ti(str, params)
// }
</script>
