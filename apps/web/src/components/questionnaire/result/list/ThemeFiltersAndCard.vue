<template>
  <div class="fr-col-12">
    <div class="fr-grid-row fr-grid-row--center fr-mt-2w">
      <div class="fr-container fr-m-0 fr-p-0">
        <div
          v-if="showThemeFilterComponent"
          class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-col-justify--left fr-pl-md-1v fr-mt-3v"
        >
          <ProgramFilterByTheme />
        </div>
      </div>
    </div>
    <div
      v-if="showObjectiveCardComponent"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-m-0 fr-p-0 fr-px-md-2v fr-mt-1v">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
          <TeeObjectiveCard
            :objective="objective as PublicodeObjective"
            radius-corner="tr"
            radius-size="2-5v"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PublicodeObjective } from '@tee/common'
import ProgramFilterByTheme from '@/components/program/list/filters/ProgramFilterByTheme.vue'
import { computed } from 'vue'
import UsedTrack from '@/utils/track/usedTrack'
import { Theme } from '@/utils/theme'
import { useProgramStore } from '@/stores/program'

interface Props {
  hasSpinner?: boolean
}

const props = defineProps<Props>()

const programStore = useProgramStore()

const hasObjectiveCard = computed(() => {
  return programStore.hasObjectiveTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective())
})

const hasObjectiveSelected = computed(() => {
  return programStore.hasObjectiveTypeSelected()
})

const objective = computed(() => {
  if (programStore.hasObjectiveTypeSelected()) {
    return programStore.programFilters.objectiveTypeSelected
  }

  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective()) {
    return Theme.getPublicodeObjectiveByObjective(UsedTrack.getPriorityObjective())
  }

  return ''
})

const showThemeFilterComponent = computed(() => {
  return !props.hasSpinner
})

const showObjectiveCardComponent = computed(() => {
  return hasObjectiveCard.value && !props.hasSpinner
})
</script>
