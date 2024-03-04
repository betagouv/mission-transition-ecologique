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
    </div>
  </div>

  <template
    v-for="category in usedCategories"
    :key="category"
  >
    <div class="fr-mb-6v">
      <div class="fr-mb-2v">
        {{ Translation.t(`categories.${category}`) }}
      </div>
      <div
        v-for="usedTrack in usedTracksRegrouped[category]"
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

import { useDebugStore } from '@/stores/debug'
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { TrackId } from '@/types'
import { RouteName } from '@/types/routeType'
import { groupBy } from '@/utils/helpers'
import Navigation from '@/utils/navigation'
import Translation from '@/utils/translation'
import { DsfrButton } from '@gouvminint/vue-dsfr'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const tracks = useTrackStore()
const debugStore = useDebugStore()
const router = useRouter()

const usedTracksRegrouped = computed(() => {
  return groupBy(useUsedTrackStore().usedTracks, 'category')
})

const usedCategories = computed(() => {
  return Object.keys(usedTracksRegrouped.value)
})

const backToTrack = async (trackId: TrackId) => {
  await router.push({
    name: RouteName.Questionnaire,
    params: { trackId: trackId },
    hash: Navigation.hashByRouteName(RouteName.Questionnaire)
  })
}
</script>
