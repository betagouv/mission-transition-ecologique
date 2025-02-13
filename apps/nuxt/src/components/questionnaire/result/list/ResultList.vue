<template>
  <ResultThemeFiltersAndCard
    id="tab-content-header"
    :has-error="hasError"
  />
  <client-only fallback-tag="div">
    <template #fallback>
      <div class="fr-container">
        <div class="fr-col-12 fr-col--middle fr-col-justify--center">
          <TeeSpinner />
        </div>
      </div>
    </template>
    <ResultProjectList
      :filtered-projects="sortedProjects"
      :has-error="hasError"
    />
  </client-only>
</template>

<script setup lang="ts">
import { ProjectManager } from '@/tools/project/projectManager'
import ProjectFilter from '@/tools/project/projectFilter'
import { useProjectStore } from '@/stores/project'
import { Theme } from '@/tools/theme'
import ProjectSorter from '@/tools/project/projectSorter'

const { projects, hasError } = storeToRefs(useProjectStore())

onNuxtReady(async () => {
  await new ProjectManager().getProjects()
})

const filteredProjects = ProjectFilter.filter(projects, Theme.getThemeFromSelectedOrPriorityTheme())

const sortedProjects = computed(() => {
  if (!filteredProjects.value) {
    return []
  }

  return ProjectSorter.sortBySector(filteredProjects.value)
})
</script>
