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
import { Project } from '@/tools/project/project'
import { computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { Theme } from '@/tools/theme'

const programStore = useProgramStore()
const projectStore = useProjectStore()
const navigationStore = useNavigationStore()

const programs = ref<ProgramData[]>([])
const projects = ref<ProjectType[]>()
const hasError = ref<boolean>(false)

navigationStore.hasSpinner = true
const programResult = await programStore.programsByUsedTracks
const projectResult = await projectStore.projects
if (programResult.isOk() && projectResult.isOk) {
  programs.value = programResult.data
  projects.value = projectResult.value
} else {
  hasError.value = true
}

navigationStore.hasSpinner = false

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const filteredProjects = Project.filter(projects, filteredPrograms, Theme.getThemeFromSelectedOrPriorityTheme())
</script>
