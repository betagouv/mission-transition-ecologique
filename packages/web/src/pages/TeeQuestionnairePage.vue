<template>
  <!-- MAIN APP COMPONENT  -->
  <div class="fr-container--fluid fr-px-2v fr-pb-20v fr-mt-0 fr-mb-20v" style="min-height: 800px">
    <router-view />
  </div>
  <!-- SHOW TeeContact ONLY IF ON RESULTS PAGE -->
  <TeeContact v-if="isTrackResults" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { tracksStore } from '../stores/tracks'
import TeeContact from '@/components/home/TeeContact.vue'

const tracks = tracksStore()

// computed
const isTrackResults = computed(() => {
  const track = tracks.getLastTrack
  return track?.component === 'results'
})
</script>
