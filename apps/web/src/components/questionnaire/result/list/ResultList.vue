<template>
  <ThemeFiltersAndCard id="tab-content-header" />
  <ResultProjectList :filtered-projects="filteredProjects" />
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { ProgramData, TrackId, Project as ProjectType, ThemeId } from '@/types'
import { Project } from '@/utils/project/project'
import { computed, onBeforeMount } from 'vue'
import Analytics from '@/utils/analytics'
import { useProjectStore } from '@/stores/project'
import UsedTrack from '@/utils/track/usedTrack'

const programStore = useProgramStore()
const projectStore = useProjectStore()
const navigationStore = useNavigationStore()

const programs = ref<ProgramData[]>([])
const projects = ref<ProjectType[]>()
const hasError = ref<boolean>(false)

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const theme = computed(() => {
  return programStore.programFilters.themeTypeSelected !== ''
    ? (programStore.programFilters.themeTypeSelected as ThemeId)
    : (UsedTrack.getPriorityTheme() ?? '')
})
const filteredProjects = Project.filter(projects, filteredPrograms, theme)

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
  Analytics.sendEvent(TrackId.Results, 'show_results')
})
</script>
