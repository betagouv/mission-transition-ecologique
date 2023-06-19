<template>
  <!-- DEBUGGING -->
  <div
    v-if="debug"
    class="vue-debug" 
    >
    <h5>DEBUG - TeeSidebar</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-12">
        <h6 class="fr-mb-1v"> usedTracks :</h6>
        <pre><code>{{ usedTracks }} </code></pre>
      </div>
    </div>
  </div>

  <!-- LIST OF USED TRACKS + MODIFY CHOICE -->
  <!-- fr-ri-check-fill -->
  <p
    v-for="usedTrack in usedTracks"
    :key="usedTrack.id"
    class="fr-mb-1v">
    <DsfrButton
      :label="tracks.getTrackTitle(usedTrack.id, choices.lang)"
      :icon="`${ usedTrack.completed ? false : 'ri-arrow-right-line'}`"
      :disabled="!usedTrack.completed"
      tertiary
      no-outline
      @click="backToTrack(usedTrack.id)"/>
    <div v-if="usedTrack.completed">
      <p
        v-for="(vt, i) in usedTrack.selected"
        :key="`${usedTrack.id}-${i}`"
        class="fr-pl-10v fr-mb-2v">
        <span class="fr-icon-check-line fr-icon--sm" aria-hidden="true"></span>
        {{ vt.title[choices.lang] }}
      </p>
    </div>
  </p>
</template>

<script setup lang="ts">

// import { computed } from 'vue'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'

// @ts-ignore
// import type { Track, Translations } from '@/types/index'

interface Props {
  usedTracks: any[],
  debug?: boolean,
}
const props = defineProps<Props>()

const tracks = tracksStore()
const choices = choicesStore()

// const onlyCompletedTracks = computed(() => {
//   const completedTracks = tracks.usedTracks.filter(usedTrack => usedTrack.completed)
//   return completedTracks
// })

const backToTrack = async (trackId: string) => {
  console.log()
  console.log('TeeSidebar > backToTrack > trackId :', trackId)
  await tracks.setUsedTracksAsNotCompleted(trackId)
  tracks.removeFurtherUsedTracks(trackId)
}
</script>
