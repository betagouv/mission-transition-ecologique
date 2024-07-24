<template>
  <div class="fr-col-12">
    <div class="fr-grid-row fr-grid-row--center fr-mt-2w">
      <div class="fr-container">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-mt-3v">
          <ThemeFilter :objective="objective as Objective" />
        </div>
      </div>
    </div>
    <div
      v-if="showObjectiveCardComponent"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-mt-1v">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
          <ThemeCard
            :objective="objective as Objective"
            radius-corner="tr"
            radius-size="2-5v"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Objective } from '@/types'
import { computed } from 'vue'
import UsedTrack from '@/utils/track/usedTrack'
import { Theme } from '@/utils/theme'
import { useProgramStore } from '@/stores/program'

const programStore = useProgramStore()

const hasObjectiveCard = computed(() => {
  return programStore.hasObjectiveTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective())
})

const objective = computed(() => {
  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective()) {
    return Theme.getObjectiveByValue(UsedTrack.getPriorityObjective())
  }

  if (programStore.hasObjectiveTypeSelected()) {
    return programStore.programFilters.objectiveTypeSelected
  }

  return ''
})

const showObjectiveCardComponent = computed(() => {
  return hasObjectiveCard.value
})
</script>
