<template>
  <!--  List of project cards-->
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0 fr-mb-0 fr-mt-6v">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-mb-4v fr-pl-2w fr-pl-md-0 fr-col-12 fr-text--blue-france fr-font-style--italic">
        <div v-if="haveProjects && countProjects > 1">
          {{ countProjects }}
          {{ countProjects > 1 ? Translation.t('results.results') : Translation.t('results.result') }}
        </div>
      </div>
      <ResultListNoResults
        :has-error="hasError"
        :has-spinner="hasSpinner"
        :count-filtered-programs="countFilteredPrograms"
      />
      <div class="fr-col-12">
        <div class="fr-container--fluid fr-container--fluid--no-overflow">
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-md--left">
            <div
              v-for="project in sortedProjects"
              :key="project.id"
              class="fr-col-11 fr-col-sm-12 fr-col-md-6 fr-col-lg-4"
            >
              <!--              <router-link-->
              <!--                v-for="project in sortedProjects"-->
              <!--                :id="project.id"-->
              <!--                :key="project.id"-->
              <!--                :to="getRouteToProjectDetail(project.id)"-->
              <!--                class="fr-col-12 fr-col-md-6 fr-col-lg-4"-->
              <!--              >-->
              <ProjectCard
                :project="project"
                :is-priority-project="isPriorityProject(project) && objective === ''"
                class="fr-radius-a--1v fr-card--shadow"
                :class="{ 'fr-card-priority': isPriorityProject(project) && objective === '' }"
              />
              <!--              </router-link>-->
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
import Translation from '@/utils/translation'
import projectData from '@tee/data/static/project.json'
import UsedTrack from '@/utils/track/usedTrack'
import Theme from '@/utils/theme'

interface ProjectListProps {
  filteredPrograms?: ProgramData[]
}

const props = defineProps<ProjectListProps>()

const hasError = ref<boolean>(false)

const hasSpinner = computed(() => {
  return sortedProjects.value === undefined && !hasError.value
})

const countFilteredPrograms = computed(() => {
  return props.filteredPrograms?.length || 0
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

const countProjects = computed(() => {
  return sortedProjects.value?.length || 0
})

const haveProjects = computed(() => {
  return countProjects.value > 0
})

const priorityProject = computed(() => {
  return sortedProjects.value ? sortedProjects.value.slice(0, 3) : undefined
})

const isPriorityProject = (project: Project) => {
  return priorityProject.value!.includes(project)
}

const objective = computed(() => {
  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective()) {
    return Theme.getPublicodeObjectiveByObjective(UsedTrack.getPriorityObjective())
  }

  return ''
})
</script>
