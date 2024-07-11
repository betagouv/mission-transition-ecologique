<template>
  <!--  LIST OF PROJECT CARDS-->

  <!--  Project counter -->
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-container fr-m-0 fr-p-0">
      <div class="fr-pl-2w fr-pl-md-2v fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-text--blue-france tee-font-style--italic">
        <ProjectCounter
          :sorted-projects="sortedProjects"
          :filtered-programs="filteredPrograms"
        />
      </div>
    </div>
  </div>

  <!--  Priority projects list with green banner - only for LG screen size and larger -->
  <div
    v-if="showPriorityProjectListComponent"
    class="fr-grid-row fr-grid-row--center fr-m-0 fr-p-0 fr-pb-2w fr-bg-lg--green--lightness"
  >
    <div class="fr-container fr-m-0 fr-p-0 fr-mt-2v fr-hidden fr-unhidden-lg">
      <div class="fr-grid-row fr-grid-row--center fr-m-0 fr-p-0">
        <div class="fr-col-3 fr-col-lg-2 fr-col-content--bottom fr-pb-6w">
          <img
            :src="`${publicPath}images/TEE_project_priority.svg`"
            alt=""
            class="fr-responsive-img fr-col-12 fr-pt-6w"
          />
        </div>
        <div class="fr-col-10 fr-px-0 fr-pr-md-2v">
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--left fr-px-2w fr-px-md-2v">
            <div class="fr-pt-2w fr-pl-2w fr-text--bold fr-text--blue-france">
              Voici les actions par lesquelles commencer pour votre TPE du secteur Hôtels et hébergement similaire :
            </div>
            <div
              v-for="(project, index) in priorityProjects"
              :key="project.id"
              class="fr-col-12 fr-col-md-6 fr-col-lg-4 no-outline"
            >
              <ProjectCard
                :project="project"
                :is-priority-project="true"
                :priority-order="index + 1"
                class="fr-radius-a--1v fr-card--shadow fr-card-priority fr-card-priority--highlighted fr-px-0"
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
    class="fr-grid-row fr-grid-row--center fr-m-0 fr-p-0"
  >
    <div class="fr-container fr-m-0 fr-p-0 fr-mt-2w fr-hidden fr-unhidden-lg">
      <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-px-2w fr-px-md-2v">
          <div
            v-for="project in nonPriorityProjects"
            :key="project.id"
            class="fr-col-12 fr-col-md-6 fr-col-lg-4 no-outline"
          >
            <ProjectCard
              :project="project"
              class="fr-radius-a--1v fr-card--shadow"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Project list display for MD size and smaller AND/OR a theme is selected -->
  <div
    class="fr-grid-row fr-grid-row--center fr-m-0 fr-p-0"
    :class="{ 'fr-hidden-lg': hideMainProjectListComponent }"
  >
    <div class="fr-container fr-m-0 fr-p-0 fr-mt-2v">
      <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-md--left fr-px-2w fr-px-md-2v">
          <div
            v-for="project in sortedProjects"
            :key="project.id"
            class="fr-col-12 fr-col-md-6 fr-col-lg-4 no-outline"
          >
            <ProjectCard
              :project="project"
              :is-priority-project="isPriorityProject(project)"
              :is-unique-priority="isUniquePriority"
              :priority-order="getPriorityOrder(project)"
              class="fr-radius-a--1v fr-card--shadow"
              :class="{ 'fr-card-priority': isPriorityProject(project) }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type ProgramData } from '@/types'
import UsedTrack from '@/utils/track/usedTrack'
import { useProgramStore } from '@/stores/program'
import Config from '@/config'
import { Project } from '@tee/data'

interface ProjectListProps {
  sortedProjects?: Project[]
  filteredPrograms?: ProgramData[]
}

const props = defineProps<ProjectListProps>()

const programStore = useProgramStore()

const publicPath = Config.publicPath

const hasError = ref<boolean>(false)

const hasSpinner = computed(() => {
  return props.sortedProjects === undefined && !hasError.value
})

const hasPriorityProjects = computed(() => {
  return priorityProjects.value ? priorityProjects.value?.length > 0 : false
})

const isPriorityProject = (project: Project) => {
  return !UsedTrack.isSpecificGoal() ? priorityProjects.value!.includes(project) : false
}

const getPriorityOrder = (project: Project) => {
  return priorityProjects.value ? priorityProjects.value.indexOf(project) + 1 : undefined
}

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
</script>
