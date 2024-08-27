<template>
  <div
    :id="RouteName.QuestionnaireResult"
    class="fr-container--fluid fr-container--fluid--no-overflow"
  >
    <TeeDsfrBreadcrumb />
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
import { RouteName } from '@/types/routeType'
import { useNavigationStore } from '@/stores/navigation'
import UsedTrack from '@/utils/track/usedTrack'

const hasSpinner = useNavigationStore().hasSpinner
</script>
