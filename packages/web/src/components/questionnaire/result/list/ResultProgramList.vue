<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-6v">
    <div class="fr-grid-row fr-grid-row--center">
      <div
        v-if="!hasSpinner || !hasError"
        class="fr-col-9 fr-col-hidden-md fr-text-right fr-col-xs-12 fr-mb-3v"
      >
        <ProgramModalFilter />
      </div>
      <div class="fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-mb-3v fr-col-xs-12 fr-pl-3v">
        <ProgramFilterByTheme v-if="havePrograms && countPrograms > 1" />
      </div>
      <div
        v-if="hasObjectiveCard && !hasSpinner"
        class="fr-col-9 fr-col-offset-md-3 fr-col-offset-lg-2 fr-col-xs-12"
      >
        <TeeObjectiveCard
          :objective="objective as PublicodeObjective"
          radius-corner="tr"
          radius-size="2-5v"
        />
      </div>
      <div
        v-if="!hasSpinner"
        class="fr-col-2 fr-col-md-3 fr-col-lg-2 fr-col-hidden fr-col-unhidden-md"
      >
        <div class="fr-sidemenu fr-pr-0 fr-mr-3v">
          <div class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w">Filtres</div>
          <ProgramFiltersAccordion />
        </div>
      </div>
      <div class="fr-col-9 fr-col-xs-12">
        <ProgramList :filtered-programs="filteredPrograms" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ProgramData, PublicodeObjective } from '@/types'
import { computed } from 'vue'
import ProgramFilterByTheme from '@/components/program/list/filters/ProgramFilterByTheme.vue'
import ProgramFiltersAccordion from '@/components/program/list/filters/ProgramFiltersAccordion.vue'
import UsedTrack from '@/utils/track/usedTrack'
import Theme from '@/utils/theme'
import { useProgramStore } from '@/stores/program'

interface ProgramListProps {
  filteredPrograms?: ProgramData[]
}

const props = defineProps<ProgramListProps>()

const programStore = useProgramStore()

const hasError = ref<boolean>(false)

const havePrograms = computed(() => {
  return countPrograms.value > 0
})

const countPrograms = computed(() => {
  return props.filteredPrograms?.length || 0
})

const hasSpinner = computed(() => {
  return props.filteredPrograms === undefined && !hasError.value
})

const hasObjectiveCard = computed(() => {
  return programStore.hasObjectiveTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective())
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
</script>
