<template>
  <!--  List of project cards-->
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-container fr-m-0 fr-p-0">
      <ResultListNoResults
        :has-error="hasError"
        :has-spinner="hasSpinner"
        :count-filtered-programs="countFilteredPrograms"
      />

      <div class="fr-grid-row fr-grid-row--center">
        <div
          class="fr-mb-2v fr-mt-6v fr-pl-2w fr-pl-md-2v fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-text--blue-france fr-font-style--italic"
        >
          <ProjectCounter :filtered-programs="filteredPrograms" />
        </div>
      </div>
    </div>
  </div>
  <!--      PRIORITY PROJECTS -->
  <div
    v-if="hasPriorityProjects && !hasObjectiveCard && !hasObjectiveSelected"
    class="fr-mt-3v fr-bg-lg--green--lightness fr-hidden fr-unhidden-lg"
  >
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-m-0 fr-p-0">
      <div class="fr-container fr-m-0 fr-p-0">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-m-0 fr-p-0">
          <div
            v-if="!hasSpinner || !hasError"
            class="fr-col-3 fr-col-lg-2 fr-col-content--bottom fr-pb-6w"
          >
            <img
              :src="`${publicPath}images/TEE_project_priority.svg`"
              alt=""
              class="fr-responsive-img fr-col-12 fr-pt-6w"
            />
          </div>
          <div class="fr-col-12 fr-col-md-10 fr-px-0 fr-pr-md-2v">
            <div class="fr-container fr-p-0 fr-m-0">
              <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-md--left">
                <div
                  v-for="project in priorityProjects"
                  :key="project.id"
                  class="fr-col-11 fr-col-sm-12 fr-col-md-6 fr-col-lg-4"
                >
                  <ProjectCard
                    :project="project"
                    :is-priority-project="true"
                    class="fr-radius-a--1v fr-card--shadow fr-card-priority fr-px-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="hasPriorityProjects && !hasObjectiveCard && !hasObjectiveSelected"
    class="fr-mt-3v fr-hidden fr-unhidden-lg"
  >
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-m-0 fr-p-0">
      <div class="fr-container fr-m-0 fr-p-0">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-px-0 fr-pr-md-2v">
          <div class="fr-container fr-p-0 fr-m-0">
            <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-md--left">
              <div
                v-for="project in nonPriorityProjects"
                :key="project.id"
                class="fr-col-11 fr-col-sm-12 fr-col-md-6 fr-col-lg-4"
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
    </div>
  </div>
  <!-- LIST DISPLAY FOR MD SIZE -->

  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-m-0 fr-p-0">
    <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-container fr-m-0 fr-p-0">
          <div class="fr-grid-row fr-grid-row--center">
            <div
              class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-pr-md-2v"
              :class="{ 'fr-hidden-lg': !hasObjectiveCard && !hasObjectiveSelected }"
            >
              <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-md--left">
                <div
                  v-for="project in sortedProjects"
                  :key="project.id"
                  class="fr-col-11 fr-col-sm-10 fr-col-md-6 fr-col-lg-4"
                >
                  <ProjectCard
                    :project="project"
                    :is-priority-project="isPriorityProject(project)"
                    class="fr-radius-a--1v fr-card--shadow"
                    :class="{ 'fr-card-priority': isPriorityProject(project) }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type ProgramData } from '@/types'
import { Project } from '@tee/common/src/project/types'
import UsedTrack from '@/utils/track/usedTrack'
import { useProgramStore } from '@/stores/program'
import Config from '@/config'

interface ProjectListProps {
  filteredProjects?: Project[]
  filteredPrograms?: ProgramData[]
}

const props = defineProps<ProjectListProps>()

const programStore = useProgramStore()

const publicPath = Config.publicPath

const hasError = ref<boolean>(false)

const hasSpinner = computed(() => {
  return sortedProjects.value === undefined && !hasError.value
})

const countFilteredPrograms = computed(() => {
  return props.filteredPrograms?.length || 0
})

const hasPriorityProjects = computed(() => {
  return priorityProjects.value ? priorityProjects.value?.length > 0 : false
})

const isPriorityProject = (project: Project) => {
  console.log('is priority project : ', !UsedTrack.isSpecificGoal() ? priorityProjects.value!.includes(project) : false, project.id)
  return !UsedTrack.isSpecificGoal() ? priorityProjects.value!.includes(project) : false
}

const sortedProjects = computed(() => {
  return props.filteredPrograms
    ? (props.filteredProjects as unknown as Project[])
        .filter((project: Project) => {
          return project.programs.some((program) => props.filteredPrograms!.some((res) => res.id === program))
        })
        .sort((a, b) => b.priority - a.priority)
    : undefined
})

const priorityProjects = computed(() => {
  const projectQty = hasObjectiveSelected.value ? 1 : 3
  return sortedProjects.value ? sortedProjects.value.slice(0, projectQty) : undefined
})

const nonPriorityProjects = computed(() => {
  return sortedProjects.value ? sortedProjects.value.slice(3) : undefined
})

const hasObjectiveCard = computed(() => {
  return programStore.hasObjectiveTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective())
})

const hasObjectiveSelected = computed(() => {
  return programStore.hasObjectiveTypeSelected()
})
</script>
