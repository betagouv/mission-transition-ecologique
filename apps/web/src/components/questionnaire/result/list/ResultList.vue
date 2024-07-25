<template>
  <ThemeFiltersAndCard id="tab-content-header" />
  <ResultProjectList :filtered-projects="filteredProjects" />
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { ProgramData, Objective, TrackId, Project } from '@/types'
import { computed, onBeforeMount } from 'vue'
import Matomo from '@/utils/matomo'
import { useProjectStore } from '@/stores/project'
import UsedTrack from '@/utils/track/usedTrack'
import { Theme } from '@/utils/theme'

const programStore = useProgramStore()
const projectStore = useProjectStore()
const navigationStore = useNavigationStore()

const programs = ref<ProgramData[]>([])
const projects = ref<Project[]>()
const hasError = ref<boolean>(false)

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const filteredProjects = computed(() => {
  if (!projects.value) {
    return undefined
  }

  return projectStore.getProjectsByObjectiveAndEligibility(
    projects.value,
    getObjectiveForProjectFiltering(),
    filteredPrograms.value ?? undefined
  )
})

const getObjectiveForProjectFiltering = () => {
  return programStore.programFilters.objectiveTypeSelected !== ''
    ? (programStore.programFilters.objectiveTypeSelected as Objective)
    : Theme.getObjectiveByValue(UsedTrack.getPriorityObjective())
}

onBeforeMount(async () => {
  navigationStore.hasSpinner = true
  const programResult = await programStore.programsByUsedTracks
  const projectResult = await projectStore.projects
  if (programResult.isOk && projectResult.isOk) {
    programs.value = programResult.value
    projects.value = projectResult.value
  } else {
    hasError.value = true
  }

  navigationStore.hasSpinner = false
  // analytics / send event
  Matomo.sendEvent(TrackId.Results, 'show_results')
})
</script>
