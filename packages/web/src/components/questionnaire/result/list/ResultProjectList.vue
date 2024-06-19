<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-6v">
    <div class="fr-grid-row fr-grid-row--center">
      <div
        v-if="(!hasObjectiveCard || programStore.hasObjectiveTypeSelected()) && !hasSpinner"
        class="fr-col-9 fr-col-xs-12 fr-col-offset-md-3 fr-col-offset-lg-2 fr-mb-3v fr-pl-3v"
      >
        <ProgramFilterByTheme v-if="havePrograms && countPrograms > 1" />
      </div>
      <div
        v-if="hasObjectiveCard && !hasSpinner"
        class="fr-col-9 fr-col-xs-12 fr-col-offset-md-3 fr-col-offset-lg-2"
      >
        <TeeObjectiveCard
          :objective="objective as PublicodeObjective"
          radius-corner="tr"
          radius-size="2-5v"
        />
      </div>
      <div
        v-if="!hasSpinner || !hasError"
        class="fr-col-3 fr-col-lg-2 fr-pt-12w fr-col-hidden fr-col-unhidden-md"
      >
        <img
          v-if="!hasObjectiveCard || programStore.hasObjectiveTypeSelected()"
          :src="`${publicPath}images/TEE_project_priority.svg`"
          alt=""
          class="fr-responsive-img fr-col-10 fr-col-xl-8 fr-col-hidden fr-col-unhidden-lg fr-pt-10w"
        />
      </div>
      <div class="fr-col-9 fr-col-xs-12">
        <ProjectList :filtered-programs="filteredPrograms" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ProgramData, PublicodeObjective } from '@/types'
import { computed } from 'vue'
import ProgramFilterByTheme from '@/components/program/list/filters/ProgramFilterByTheme.vue'
import UsedTrack from '@/utils/track/usedTrack'
import Theme from '@/utils/theme'
import { useProgramStore } from '@/stores/program'
import Config from '@/config'

interface ProgramListProps {
  filteredPrograms?: ProgramData[]
}

const props = defineProps<ProgramListProps>()

const programStore = useProgramStore()

const publicPath = Config.publicPath

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
