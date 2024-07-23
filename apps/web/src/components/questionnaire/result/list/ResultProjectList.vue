<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-container fr-mt-3v">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-col-justify--center">
          <ResultListNoResults
            v-if="showNoResultsComponent"
            :has-error="hasError"
            :count-items="countProjects"
          />
        </div>
      </div>
    </div>
    <div
      v-if="showProjectListComponent"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-mb-2v">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
          <h2 class="fr-text--bold fr-mb-0">Quel est votre projet ?</h2>
        </div>
      </div>
    </div>
    <ProjectList :sorted-projects="sortedProjects" />
  </div>
</template>

<script setup lang="ts">
import { Project } from '@/types'
import { computed } from 'vue'
import UsedTrack from '@/utils/track/usedTrack'
import { useProgramStore } from '@/stores/program'

interface ProjectListProps {
  filteredProjects?: Project[]
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

const hasObjectiveCard = computed(() => {
  return programStore.hasObjectiveTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective())
})

const sortedProjects = computed(() => {
  return props.filteredProjects
    ? (props.filteredProjects as unknown as Project[]).sort((a, b) => (a.priority && b.priority ? a.priority - b.priority : 0))
    : undefined
})

const showNoResultsComponent = computed(() => {
  return hasError.value || !countProjects.value
})

const showProjectListComponent = computed(() => {
  return hasObjectiveCard.value && UsedTrack.isSpecificGoal() && hasProjects.value
})
</script>
