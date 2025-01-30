<template>
  <div
    v-if="filtersStore.hasThemeTypeSelected()"
    class="fr-grid-row fr-grid-row--center"
  >
    <div class="fr-container">
      <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-text--blue-france tee-font-style--italic">
        <TeeCounterResult :to-count="sortedProjects" />
      </div>
    </div>
  </div>

  <!--  Priority projects list with green banner - only for LG screen size and larger -->
  <div
    v-if="showPriorityProjectListComponent"
    class="fr-grid-row fr-grid-row--center fr-bg-lg--green--light"
  >
    <div class="fr-container fr-pb-2w fr-mt-2v fr-hidden fr-unhidden-lg">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-2 fr-col-content--bottom fr-pb-6w fr-pr-2v">
          <img
            src="/images/TEE_project_priority.svg"
            alt=""
            class="fr-responsive-img"
          />
        </div>
        <div class="fr-col-10">
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--left">
            <div class="fr-col-12 fr-pt-3w fr-pb-2v fr-text--bold fr-text--blue-france">
              {{ resume }}
            </div>
            <div
              v-for="(project, index) in priorityProjects"
              :key="project.id"
              class="fr-col-4 no-outline"
            >
              <ProjectCard
                :project="project"
                :is-priority-project="true"
                :priority-order="index + 1"
                class="fr-radius-a--1v fr-card--shadow fr-card-priority fr-card-priority--highlighted fr-enlarge-link"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--  Rest of projects list following top banner - only for LG screen size and larger -->
  <div
    v-if="showPriorityProjectListComponent"
    class="fr-grid-row fr-grid-row--center fr-mb-1v"
  >
    <div class="fr-container fr-mt-2w fr-hidden fr-unhidden-lg">
      <div class="fr-col-10 fr-col-offset-2">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--left">
          <div
            v-for="project in nonPriorityProjects"
            :key="project.id"
            class="fr-col-4 no-outline"
          >
            <ProjectCard
              :project="project"
              class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Project list display for MD size and smaller AND/OR a theme is selected -->
  <div
    class="fr-grid-row fr-grid-row--center fr-mb-1v"
    :class="{ 'fr-hidden-lg': hideMainProjectListComponent }"
  >
    <div class="fr-container fr-mt-2v">
      <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-md--left">
          <div
            v-for="project in sortedProjects"
            :key="project.id"
            class="fr-col-12 fr-col-sm-6 fr-col-md-6 fr-col-lg-4 no-outline"
          >
            <ProjectCard
              :project="project"
              :is-priority-project="isPriorityProject(project)"
              :is-unique-priority="isUniquePriority"
              :priority-order="getPriorityOrder(project)"
              class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
              :class="{ 'fr-card-priority': isPriorityProject(project) }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrackStructure from '@/tools/questionnaire/track/trackStructure'
import Translation from '@/tools/translation'
import { computed } from 'vue'
import { ProjectType } from '@/types'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { CompanyData } from '@/tools/companyData'
import { useFiltersStore } from '@/stores/filters'

interface ProjectListProps {
  sortedProjects?: ProjectType[]
}
const props = defineProps<ProjectListProps>()

const filtersStore = useFiltersStore()
const isSpecificGoal = UsedTrack.isSpecificGoal()
const resume: string = Translation.t('project.result.resume', {
  effectif: Translation.t('enterprise.structureSize.' + (TrackStructure.getSize() ?? CompanyData.size ?? '')),
  secteur: TrackStructure.getSector() ?? CompanyData.company?.secteur ?? ''
})

const hasPriorityProjects = computed(() => {
  return priorityProjects.value ? priorityProjects.value?.length > 0 : false
})

const isUniquePriority = computed(() => {
  return priorityProjects.value ? priorityProjects.value.length === 1 : false
})

const priorityProjects = computed(() => {
  const projectQty = hasThemeSelected.value ? 1 : 3
  return props.sortedProjects ? props.sortedProjects.slice(0, projectQty) : undefined
})

const nonPriorityProjects = computed(() => {
  return props.sortedProjects ? props.sortedProjects.slice(3) : undefined
})

const hasThemeCard = computed(() => {
  return filtersStore.hasThemeTypeSelected() || (isSpecificGoal && UsedTrack.hasPriorityTheme())
})

const hasThemeSelected = computed(() => {
  return filtersStore.hasThemeTypeSelected()
})

const showPriorityProjectListComponent = computed(() => {
  return hasPriorityProjects.value && !hasThemeCard.value && !hasThemeSelected.value
})

const hideMainProjectListComponent = computed(() => {
  return !hasThemeCard.value && !hasThemeSelected.value
})

const isPriorityProject = (project: ProjectType) => {
  return !isSpecificGoal ? priorityProjects.value!.includes(project) : false
}

const getPriorityOrder = (project: ProjectType) => {
  return priorityProjects.value ? priorityProjects.value.indexOf(project) + 1 : undefined
}
</script>
