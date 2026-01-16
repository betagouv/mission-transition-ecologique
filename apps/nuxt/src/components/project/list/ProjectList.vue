<template>
  <div
    v-if="filtersStore.hasThemeTypeSelected()"
    class="fr-grid-row fr-grid-row--center"
  >
    <div class="fr-container">
      <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-text--blue-900 tee-font-style--italic">
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
            <div class="fr-col-12 fr-pt-3w fr-pb-2v fr-text--bold fr-text--blue-900">
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
                class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
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
            class="fr-col-12 fr-col-sm-6 fr-col-md-6 fr-col-lg-4"
          >
            <ProjectCard
              :project="project"
              :is-priority-project="isPriorityProject(project)"
              :is-unique-priority="isUniquePriority"
              :priority-order="getPriorityOrder(project)"
              class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
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
import { CompanyData } from '@/tools/companyData'
import { useFiltersStore } from '@/stores/filters'
import ProjectPriority from '@/tools/project/projectPriority'

interface ProjectListProps {
  sortedProjects?: ProjectType[]
}
const props = defineProps<ProjectListProps>()

const filtersStore = useFiltersStore()
const resume = computed<string>(() => {
  return Translation.t('project.result.resume', {
    effectif: Translation.t('enterprise.structureSize.' + (CompanyData.size ?? TrackStructure.getSize() ?? '')),
    secteur: CompanyData.company?.secteur ?? TrackStructure.getSector() ?? ''
  })
})

const priorityProjects = computed(() => ProjectPriority.get(props.sortedProjects))

const hasPriorityProjects = computed(() => ProjectPriority.has(priorityProjects.value))

const isUniquePriority = computed(() => ProjectPriority.isUnique(priorityProjects.value))

const nonPriorityProjects = computed(() => ProjectPriority.getNonPriorityProjects(props.sortedProjects, priorityProjects.value))

const hasThemeSelected = computed(() => {
  return filtersStore.hasThemeTypeSelected()
})

const showPriorityProjectListComponent = computed(() => {
  return hasPriorityProjects.value && !hasThemeSelected.value
})

const hideMainProjectListComponent = computed(() => {
  return !hasThemeSelected.value
})

const isPriorityProject = (project: ProjectType) => ProjectPriority.is(project, priorityProjects.value)

const getPriorityOrder = (project: ProjectType) => ProjectPriority.getIndex(project, priorityProjects.value)
</script>
