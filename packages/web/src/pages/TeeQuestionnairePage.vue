<template>
  <div
    class="fr-container--fluid fr-px-0v fr-px-md-2v fr-mt-0 fr-mb-10v"
    style="min-height: 800px"
  >
    <router-view />
  </div>
  <ContactHelp v-if="isTrackResults" />
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeQuestionnairePage > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed } from 'vue'
import { useTracksStore } from '@/stores/tracks'
import ContactHelp from '@/components/contact/ContactHelp.vue'
import { TrackComponents } from '@/types'

const tracks = useTracksStore()

const isTrackResults = computed(() => {
  const track = tracks.getLastTrack
  return track?.component === TrackComponents.Results
})
</script>
