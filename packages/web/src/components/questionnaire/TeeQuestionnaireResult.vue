<template>
  <div
    :id="RouteName.QuestionnaireResult"
    class="fr-container--fluid fr-container--fluid--no-overflow"
  >
    <TeeEligibilityCriteriaBar
      v-if="linkToPreviousButton"
      bg-color="blue-light"
      bg-bar-color="blue--light"
      :previous-route="linkToPreviousButton"
    />
    <ProgramList />
  </div>
</template>

<script setup lang="ts">
import ProgramList from '@/components/program/list/ProgramList.vue'
import { RouteName } from '@/types/routeType'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { useNavigationStore } from '@/stores/navigation'

const usedTrackStore = useUsedTrackStore()
const navigationStore = useNavigationStore()

const linkToPreviousButton = computed(() => {
  const trackId = usedTrackStore.getPreviousCompletedUsedTrackId()
  if (trackId) {
    return navigationStore.routeByTrackId(trackId)
  }
})
</script>
