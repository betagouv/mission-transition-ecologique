<template>
  <ThemeFiltersAndCard id="tab-content-header" />
  <ResultProjectList
    :filtered-projects="filteredProjects"
    :has-error="hasError"
  />
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { ProgramData, Project as ProjectType } from '@/types'
import { Project } from '@/utils/project/project'
import { computed, onBeforeMount } from 'vue'
import { useProjectStore } from '@/stores/project'
import { Theme } from '@/utils/theme'

const programStore = useProgramStore()
const projectStore = useProjectStore()
const navigationStore = useNavigationStore()

const programs = ref<ProgramData[]>([])
const projects = ref<ProjectType[]>()
const hasError = ref<boolean>(false)

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const filteredProjects = Project.filter(projects, filteredPrograms, Theme.getThemeFromSelectedOrPriorityTheme())

const getProgramsAndProjects = async () => {
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
}

onBeforeMount(async () => {
  await getProgramsAndProjects()
})

watchEffect(async () => {
  console.log('registeredData changed: UPDATE PROGRAMS')
  await getProgramsAndProjects()
})
</script>
