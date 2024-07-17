<template>
  <!--  LIST OF PROJECT CARDS-->

  <!--  Project counter -->
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-container">
      <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-text--base-blue-france tee-font-style--italic">
        <ProjectCounter :sorted-projects="sortedProjects" />
      </div>
    </div>
  </div>

  <!--  Priority projects list with green banner - only for LG screen size and larger -->
  <div
    v-if="showPriorityProjectListComponent"
    class="fr-grid-row fr-grid-row--center fr-bg-lg--green--lightness"
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
            <div class="fr-col-12 fr-pt-2w fr-text--bold fr-text--base-blue-france">
              {{ resume }}
            </div>
            <router-link
              v-for="(project, index) in priorityProjects"
              :id="project.slug"
              :key="project.id"
              :to="getRouteToProjectDetail(project)"
              class="fr-col-4 no-outline"
            >
              <ProjectCard
                :project="project"
                :is-priority-project="true"
                :priority-order="index + 1"
                class="fr-radius-a--1v fr-card--shadow fr-card-priority fr-card-priority--highlighted"
              />
            </router-link>
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
          <router-link
            v-for="project in nonPriorityProjects"
            :id="project.slug"
            :key="project.id"
            :to="getRouteToProjectDetail(project)"
            class="fr-col-4 no-outline"
          >
            <ProjectCard
              :project="project"
              class="fr-radius-a--1v fr-card--shadow"
            />
          </router-link>
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
          <router-link
            v-for="project in sortedProjects"
            :id="project.slug"
            :key="project.id"
            :to="getRouteToProjectDetail(project)"
            class="fr-col-12 fr-col-sm-6 fr-col-md-6 fr-col-lg-4 no-outline"
          >
            <ProjectCard
              :project="project"
              :is-priority-project="isPriorityProject(project)"
              :is-unique-priority="isUniquePriority"
              :priority-order="getPriorityOrder(project)"
              class="fr-radius-a--1v fr-card--shadow"
              :class="{ 'fr-card-priority': isPriorityProject(project) }"
            />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrackStructure from '@/utils/track/trackStructure'
import Translation from '@/utils/translation'
import { computed } from 'vue'
import { RouteName, Project } from '@/types'
import UsedTrack from '@/utils/track/usedTrack'
import { useProgramStore } from '@/stores/program'
import { useNavigationStore } from '@/stores/navigation'
import { type RouteLocationRaw } from 'vue-router'

interface ProjectListProps {
  sortedProjects?: Project[]
}

const props = defineProps<ProjectListProps>()

const navigationStore = useNavigationStore()
const programStore = useProgramStore()

const resume: string = Translation.t('project.result.resume', {
  effectif: Translation.t('enterprise.structureSize.' + TrackStructure.getSize()),
  secteur: TrackStructure.getSector(),
  region: TrackStructure.getRegion()
})

const hasPriorityProjects = computed(() => {
  return priorityProjects.value ? priorityProjects.value?.length > 0 : false
})

const isUniquePriority = computed(() => {
  return priorityProjects.value ? priorityProjects.value.length === 1 : false
})

const priorityProjects = computed(() => {
  const projectQty = hasObjectiveSelected.value ? 1 : 3
  return props.sortedProjects ? props.sortedProjects.slice(0, projectQty) : undefined
})

const nonPriorityProjects = computed(() => {
  return props.sortedProjects ? props.sortedProjects.slice(3) : undefined
})

const hasObjectiveCard = computed(() => {
  return programStore.hasObjectiveTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective())
})

const hasObjectiveSelected = computed(() => {
  return programStore.hasObjectiveTypeSelected()
})

const showPriorityProjectListComponent = computed(() => {
  return hasPriorityProjects.value && !hasObjectiveCard.value && !hasObjectiveSelected.value
})

const hideMainProjectListComponent = computed(() => {
  return !hasObjectiveCard.value && !hasObjectiveSelected.value
})

const isPriorityProject = (project: Project) => {
  return !UsedTrack.isSpecificGoal() ? priorityProjects.value!.includes(project) : false
}

const getPriorityOrder = (project: Project) => {
  return priorityProjects.value ? priorityProjects.value.indexOf(project) + 1 : undefined
}

const getRouteToProjectDetail = (project: Project): RouteLocationRaw => {
  return {
    name: RouteName.ProjectResultDetail,
    params: { projectSlug: project.slug },
    query: navigationStore.query
  }
}
</script>
