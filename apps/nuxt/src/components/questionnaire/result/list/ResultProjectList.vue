<template>
  <!-- PROGRAMS AS LIST OF CARDS -->
  <div class="fr-container--fluid fr-container--fluid--no-overflow">
    <div
      v-if="showNoResults"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-container fr-mt-3v">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-col-justify--center">
          <ResultListNoResults
            :has-error="hasError"
            message="Aucune idée d’action n’a pu être identifiée sur cette thématique..."
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
import UsedTrack from '@/tools/track/usedTrack'
import { useProgramStore } from '@/stores/program'
import { Project as UtilsProject } from '@/tools/project/project'

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

const hasThemeCard = computed(() => {
  return programStore.hasThemeTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme())
})

const sortedProjects = UtilsProject.sort(computed(() => props.filteredProjects))

const showNoResults = computed(() => {
  return hasError.value || (!countProjects.value && props.filteredProjects !== undefined)
})

const showProjectListComponent = computed(() => {
  return hasThemeCard.value && UsedTrack.isSpecificGoal() && hasProjects.value
})
</script>
