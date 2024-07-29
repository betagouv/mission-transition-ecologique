<template>
  <div
    :id="RouteName.QuestionnaireResult"
    class="fr-container--fluid fr-container--fluid--no-overflow"
  >
    <TeeEligibilityCriteriaBar
      v-if="linkToPreviousButton"
      :bg-color="Color.blueLight"
      :bg-bar-color="Color.blueLighted"
      :previous-route="linkToPreviousButton"
    />
    <div
      v-if="hasSpinner"
      class="fr-grid-row fr-grid-row--center"
    >
      <TeeSpinner scale="6" />
    </div>
    <div v-else>
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-text-center-md">
            <ResultHeader />
          </div>
        </div>
      </div>
      <ResultListInTabs v-if="UsedTrack.isNoSpecificGoal()" />
      <ResultList v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Color } from '@/types'
import { RouteName } from '@/types/routeType'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { useNavigationStore } from '@/stores/navigation'
import UsedTrack from '@/utils/track/usedTrack'

const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()

const hasSpinner = useNavigationStore().hasSpinner

const linkToPreviousButton = computed(() => {
  const trackId = usedTrackStore.getPreviousCompletedUsedTrackId()
  if (trackId) {
    return navigationStore.routeByTrackId(trackId)
  }
  return null
})
</script>
