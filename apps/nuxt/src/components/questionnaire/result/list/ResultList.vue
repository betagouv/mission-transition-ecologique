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
      :filtered-projects="filteredProjects"
      :has-error="hasError"
    />
  </client-only>
</template>

<script setup lang="ts">
import { ProjectManager } from '@/tools/project/projectManager'
import ProjectFilter from '@/tools/project/projectFilter'
import { useProjectStore } from '@/stores/project'
import { Theme } from '@/tools/theme'

const { projects, hasError } = storeToRefs(useProjectStore())

onNuxtReady(async () => {
  await new ProjectManager().getFilteredProjects()
})

const filteredProjects = ProjectFilter.filter(projects, Theme.getThemeFromSelectedOrPriorityTheme())
</script>
