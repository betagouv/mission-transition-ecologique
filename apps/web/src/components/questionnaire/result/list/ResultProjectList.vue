<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-2v">
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
      <div class="fr-container fr-m-0 fr-p-0 fr-px-md-2v fr-mt-3v">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
          <TeeObjectiveCard
            :objective="objective as PublicodeObjective"
            radius-corner="tr"
            radius-size="2-5v"
          />
        </div>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-container fr-m-0 fr-p-0 fr-px-md-2v fr-mt-3v">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-col-justify--center">
          <ResultListNoResults
            v-if="showNoResultsComponent"
            :has-error="hasError"
            :has-spinner="hasSpinner"
            :count-items="countProjects"
          />
        </div>
      </div>
    </div>
    <div
      v-if="showProjectListComponent"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-m-0 fr-p-0 fr-px-md-2v fr-mt-4w">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-pl-2w fr-pl-md-0">
          <h2 class="fr-text--bold fr-mb-0">Quel est votre projet ?</h2>
        </div>
      </div>
    </div>
    <ProjectList
      :sorted-projects="sortedProjects"
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
import { Project } from '@tee/data'

interface ProjectListProps {
  filteredProjects?: Project[]
  filteredPrograms?: ProgramData[]
}

const props = defineProps<ProjectListProps>()

const programStore = useProgramStore()

const hasError = ref<boolean>(false)

const hasProjects = computed(() => {
  return countProjects.value > 0
})

const countProjects = computed(() => {
  return props.filteredProjects?.length || 0
})

const hasSpinner = computed(() => {
  return props.filteredProjects === undefined && !hasError.value
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
  return props.filteredPrograms ? (props.filteredProjects as unknown as Project[]).sort((a, b) => a.priority - b.priority) : undefined
})

const showNoResultsComponent = computed(() => {
  return hasSpinner.value || hasError.value || !countProjects.value
})

const showThemeFilterComponent = computed(() => {
  return (!hasObjectiveCard.value || hasObjectiveSelected.value) && !hasSpinner.value && countProjects.value > 1
})

const showObjectiveCardComponent = computed(() => {
  return hasObjectiveCard.value && !hasSpinner.value
})

const showProjectListComponent = computed(() => {
  return hasObjectiveCard.value && !hasSpinner.value && UsedTrack.isSpecificGoal() && hasProjects.value
})
</script>
