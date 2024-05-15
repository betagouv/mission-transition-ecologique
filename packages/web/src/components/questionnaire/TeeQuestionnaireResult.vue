<template>
  <div
    :id="RouteName.QuestionnaireResult"
    class="fr-container--fluid"
  >
    <TeeEligibilityCriteria
      v-if="linkToPreviousButton"
      bg-color="blue-light"
      :previous-route="linkToPreviousButton"
    />
    <div class="fr-grid-row fr-grid-row-gutters fr-justify-center">
      <div
        class="fr-tee-add-padding fr-mt-10v fr-col-3 fr-col-md-4 fr-col-lg-3 fr-col-xl-2 fr-col-sm-hide"
        style="height: 100%"
      >
        <TrackSidebar />
      </div>

      <div class="fr-grid-row--center fr-px-md-2v fr-col fr-col-sm-12 fr-col-md-8 fr-col-lg-9 fr-col-xl-8">
        <ProgramList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgramList from '@/components/program/list/ProgramList.vue'
import TrackSidebar from '@/components/track/TrackSidebar.vue'
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
