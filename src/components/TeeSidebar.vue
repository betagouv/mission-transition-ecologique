<template>
  <!-- DEBUGGING -->
  <div
    v-if="debug"
    class="vue-debug" 
    >
    <h5>DEBUG - TeeSidebar</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-12">
        <h6 class="fr-mb-1v"> tracks.usedTracks :</h6>
        <pre><code>{{ tracks.usedTracks }} </code></pre>
      </div>
    </div>
  </div>

  <!-- LIST OF USED TRACKS + MODIFY CHOICE -->
  <p
    v-for="usedTrack in tracks.usedTracks"
    :key="usedTrack.id"
    class="fr-mb-1v">
    <DsfrButton
      :label="tracks.getTrackTitle(usedTrack.id, choices.lang)"
      :icon="`ri-${ usedTrack.completed ? 'check-fill' : 'arrow-right-line'}`"
      :disabled="!usedTrack.completed"
      tertiary
      no-outline
      @click="backToTrack(usedTrack.id)"/>
  </p>
</template>

<script setup lang="ts">

import { computed } from 'vue'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'

// @ts-ignore
// import type { Track, Translations } from '@/types/index'

interface Props {
  debug?: boolean,
}
const props = defineProps<Props>()

const tracks = tracksStore()
const choices = choicesStore()

// const onlyCompletedTracks = computed(() => {
//   const completedTracks = tracks.usedTracks.filter(usedTrack => usedTrack.completed)
//   return completedTracks
// })

const backToTrack = (trackId: string) => {
  console.log()
  console.log('TeeSidebar > backToTrack > trackId :', trackId)
  tracks.setUsedTracksAsNotCompleted(trackId)
  tracks.removeFurtherUsedTracks(trackId)
}
</script>
