<template>
  <!-- MAIN APP COMPONENT  -->
  <div
    class="fr-container--fluid fr-px-20v fr-pb-20v fr-mt-10v fr-mb-20v"
    style="min-height: 800px">
    <router-view/>
  </div>
  <!-- SHOW TeeContact ONLY IF ON RESULTS PAGE -->
  <TeeContact
    v-if="isTrackResults"/>
</template>

<script setup lang="ts">

import { computed } from 'vue'

import { tracksStore } from '../stores/tracks'

// @ts-ignore
import type { Track } from '@/types/index'
// @ts-ignore
import TeeContact from '@/components/home/TeeContact.vue'

const tracks = tracksStore()

// computed
const isTrackResults = computed(() => {
  const track: Track | any = tracks.getLastTrack
  return track?.component === 'results'
})
</script>