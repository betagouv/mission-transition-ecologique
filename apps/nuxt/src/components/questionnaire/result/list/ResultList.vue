<template>
  <ThemeFiltersAndCard id="tab-content-header" />
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
import { useNavigationStore } from '@/stores/navigation'
import ProjectFilter from '@/tools/project/projectFilter'
import { Project as ProjectType } from '@/types'
import { useProjectStore } from '@/stores/project'
import { Theme } from '@/tools/theme'
import CompanyDataStorage from '@/tools/storage/companyDataStorage'

const projectStore = useProjectStore()
const navigationStore = useNavigationStore()

const projects = ref<ProjectType[]>()
const hasError = ref<boolean>(false)

const registeredData = CompanyDataStorage.getData()

const filteredProjects = ProjectFilter.filter(projects, Theme.getThemeFromSelectedOrPriorityTheme())

const getProgramsAndProjects = async () => {
  navigationStore.hasSpinner = true
  const projectResult = await projectStore.eligibleProjects
  if (projectResult.isOk()) {
    projects.value = projectResult.data
  } else {
    hasError.value = true
  }
  navigationStore.hasSpinner = false
}

watchPostEffect(async () => {
  registeredData.value
  await getProgramsAndProjects()
})
</script>
