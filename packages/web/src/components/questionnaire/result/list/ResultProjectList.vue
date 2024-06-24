<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-6v">
    <div class="fr-grid-row fr-grid-row--center">
      <div
        v-if="(!hasObjectiveCard || hasObjectiveSelected) && !hasSpinner"
        class="fr-col-9 fr-col-xs-12 fr-col-offset-md-3 fr-col-offset-lg-2 fr-mb-3v fr-pl-3v"
      >
        <ProgramFilterByTheme v-if="havePrograms && countPrograms > 1" />
      </div>
    </div>
    <div
      v-if="hasObjectiveCard && !hasSpinner"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-col-12 fr-col-md-9 fr-col-offset-md-3 fr-col-offset-lg-2">
        <div class="fr-container fr-m-0 fr-p-0 fr-pr-md-4w">
          <TeeObjectiveCard
            :objective="objective as PublicodeObjective"
            radius-corner="tr"
            radius-size="2-5v"
          />
        </div>
      </div>
    </div>
    <ProjectList
      v-if="havePrograms && !hasSpinner"
      :filtered-projects="sortedProjects"
      :filtered-programs="props.filteredPrograms"
    />
  </div>
</template>

<script setup lang="ts">
import { type ProgramData, PublicodeObjective } from '@/types'
import { computed } from 'vue'
import ProgramFilterByTheme from '@/components/program/list/filters/ProgramFilterByTheme.vue'
import UsedTrack from '@/utils/track/usedTrack'
import Theme from '@/utils/theme'
import { useProgramStore } from '@/stores/program'
import { Project } from '@tee/common/src/project/types'
import projectData from '@tee/data/static/project.json'

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

const hasObjectiveSelected = computed(() => {
  return programStore.hasObjectiveTypeSelected()
})

const sortedProjects = computed(() => {
  return props.filteredPrograms
    ? (projectData as unknown as Project[])
        .filter((project: Project) => {
          return project.programs.some((program) => props.filteredPrograms!.some((res) => res.id === program))
        })
        .sort((a, b) => b.priority - a.priority)
    : undefined
})
</script>
