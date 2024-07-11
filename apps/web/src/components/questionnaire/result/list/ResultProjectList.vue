<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow">
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
      <div class="fr-container fr-m-0 fr-p-0 fr-px-md-2v fr-mb-2v">
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
import { type ProgramData, PublicodeObjective, Project } from '@/types'
import { computed } from 'vue'
import UsedTrack from '@/utils/track/usedTrack'
import { useProgramStore } from '@/stores/program'

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

const sortedProjects = computed(() => {
  return props.filteredPrograms
    ? (props.filteredProjects as unknown as Project[]).sort((a, b) => (a.priority && b.priority ? a.priority - b.priority : 0))
    : undefined
})

const showNoResultsComponent = computed(() => {
  return hasSpinner.value || hasError.value || !countProjects.value
})

const showProjectListComponent = computed(() => {
  return hasObjectiveCard.value && !hasSpinner.value && UsedTrack.isSpecificGoal() && hasProjects.value
})
</script>
