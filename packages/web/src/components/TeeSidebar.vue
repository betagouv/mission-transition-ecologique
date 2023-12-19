<template>
  <!-- DEBUGGING -->
  <div
    v-if="debug"
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

  <!-- LIST OF USED TRACKS + MODIFY CHOICE -->
  <!-- fr-ri-check-fill -->
  <!-- <template
    v-for="usedTrack in usedTracks"
    :key="usedTrack.id">
    <div
      v-show="usedTrack.step > 1"
      class="fr-mb-1v">
      <DsfrButton
        :label="tracks.getTrackTitle(usedTrack.id, choices.lang)"
        :icon="`${ usedTrack.completed ? '' : 'ri-arrow-right-line'}`"
        :disabled="!usedTrack.completed"
        tertiary
        no-outline
        @click="backToTrack(usedTrack.id)"/>
      <template
        v-if="usedTrack.completed && usedTrack.selected.length">
        <p
          v-for="(vt, idx) in usedTrack.selected"
          :key="`${usedTrack.id}-${idx}`"
          class="fr-pl-10v fr-mb-2v">
          <span class="fr-icon-check-line fr-icon--sm" aria-hidden="true"></span>
          {{ vt.title[choices.lang] }}
        </p>
      </template>
    </div>
  </template> -->

  <template
    v-for="categ in usedCategories"
    :key="categ"
  >
    <div class="fr-mb-6v">
      <div class="fr-mb-2v">
        {{ choices.t(`categories.${categ}`) }}
      </div>
      <!-- <DsfrButton
        :label="choices.t(`categories.${categ}`)"
        class=""
        tertiary
        no-outline
        @click="usedTracksRegrouped[categ][0].id"
      /> -->
      <div
        v-for="usedTrack in usedTracksRegrouped[categ]"
        :key="usedTrack.id"
      >
        <div class="fr-mb-1v">
          <DsfrButton
            :label="tracks.getTrackTitle(usedTrack.id as TrackId, choices.lang)"
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
import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'
import type { UsedTrack } from '@/types/index'
import { groupBy } from '../utils/helpers'
import { TrackId } from '@/types/index'

interface Props {
  usedTracks: UsedTrack[]
  debug?: boolean
}
const props = defineProps<Props>()

const tracks = tracksStore()
const choices = choicesStore()

interface UsedTrackRegrouped {
  [name: string]: UsedTrack[]
}

const usedTracksRegrouped = computed(() => {
  const trackWithCategs = props.usedTracks.map((usedTrack: UsedTrack) => {
    const tracksByCateg = {
      ...usedTrack,
      category: tracks.getTrackCategory(usedTrack.id as TrackId)
    }
    return tracksByCateg
  })

  const trackCategs: UsedTrackRegrouped = groupBy(trackWithCategs, 'category')
  return trackCategs
})

const usedCategories = computed(() => {
  return Object.keys(usedTracksRegrouped.value)
})

const backToTrack = (trackId: string) => {
  tracks.setUsedTracksAsNotCompleted(trackId)
  tracks.removeFurtherUsedTracks(trackId)
}
</script>
