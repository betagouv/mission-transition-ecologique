<template>
  <ThemeFiltersAndCard id="tab-content-header" />
  <ResultProjectList
    :filtered-projects="filteredProjects"
    :has-error="hasError"
  />
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { Project as ProjectType } from '@/types'
import { Project } from '@/utils/project/project'
import { onBeforeMount } from 'vue'
import { useProjectStore } from '@/stores/project'
import { Theme } from '@/utils/theme'

const projectStore = useProjectStore()
const navigationStore = useNavigationStore()

const projects = ref<ProjectType[]>()
const hasError = ref<boolean>(false)

const filteredProjects = Project.filter(projects, Theme.getThemeFromSelectedOrPriorityTheme())

onBeforeMount(async () => {
  navigationStore.hasSpinner = true
  const projectResult = await projectStore.eligibleProjects
  if (projectResult.isOk) {
    projects.value = projectResult.value
  } else {
    hasError.value = true
  }

  navigationStore.hasSpinner = false
})
</script>
