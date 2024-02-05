<template>
  <!-- DEBUGGING -->
  <div
    v-if="debugStore.is"
    class="vue-debug"
  >
    <h5>DEBUG - TeeSidebar</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-12">
        <h6 class="fr-mb-1v">usedTracksRegrouped :</h6>
        <pre><code>{{ usedTracksRegrouped }} </code></pre>
      </div>
      <div class="fr-col-12">
        <h6 class="fr-mb-1v">usedTracks :</h6>
        <pre><code>{{ usedTracks }} </code></pre>
      </div>
    </div>
  </div>

  <template
    v-for="categ in usedCategories"
    :key="categ"
  >
    <div class="fr-mb-6v">
      <div class="fr-mb-2v">
        {{ Translation.t(`categories.${categ}`) }}
      </div>
      <div
        v-for="usedTrack in usedTracksRegrouped[categ]"
        :key="usedTrack.id"
      >
        <div class="fr-mb-1v">
          <DsfrButton
            :label="tracks.getTrackTitle(usedTrack.id as TrackId, Translation.lang)"
            :disabled="!usedTrack.completed"
            class="tee-btn-sidebar"
            tertiary
            no-outline
            @click="backToTrack(usedTrack.id)"
          />
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeSidebar > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed } from 'vue'
import { useTracksStore } from '@/stores/tracks'
import Translation from '@/utils/translation'
import type { UsedTrack } from '@/types'
import { TrackId } from '@/types'
import { groupBy } from '@/utils/helpers'
import { useDebugStore } from '@/stores/debug'
import { DsfrButton } from '@gouvminint/vue-dsfr'

const tracks = useTracksStore()
const debugStore = useDebugStore()

const usedTracks = computed(() => {
  return tracks.usedTracks
})

const usedTracksRegrouped = computed(() => {
  const trackWithCategories = usedTracks.value.map((usedTrack: UsedTrack) => {
    return {
      ...usedTrack,
      category: tracks.getTrackCategory(usedTrack.id as TrackId)
    }
  })

  return groupBy(trackWithCategories, 'category')
})

const usedCategories = computed(() => {
  return Object.keys(usedTracksRegrouped.value)
})

const backToTrack = (trackId: TrackId) => {
  tracks.setUsedTracksAsNotCompleted(trackId)
  tracks.removeFurtherUsedTracks(trackId)
}
</script>
