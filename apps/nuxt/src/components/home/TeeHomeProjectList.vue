<template>
  <div class="fr-px-6v">
    <ThemeFiltersAndCard
      v-if="!hasSpinner"
      :has-error="hasError"
    />
    <SimpleProjectList
      v-if="!hasSpinner"
      :project-list="projectList"
    />
    <TeeSpinner
      v-if="hasSpinner"
      class="fr-mt-16w"
    />
    <TeeListNoResults
      v-else-if="hasNoResults"
      :has-error="hasError"
      message="Aucune idée d'action n'a pu être identifiée avec les critères choisis..."
      :count-items="countProjects"
    />
  </div>
</template>
<script setup lang="ts">
import { Theme } from '@/tools/theme'
import ProjectFilter from '@/tools/project/projectFilter'
import ProjectSorter from '@/tools/project/projectSorter'
import { useProjectStore } from '@/stores/project'
import { ProjectManager } from '@/tools/project/projectManager'

interface Props {
  limit: number
}

const props = defineProps<Props>()

onServerPrefetch(async () => {
  await new ProjectManager().getProjects()
})

onNuxtReady(async () => {
  await new ProjectManager().getProjects()
})

const theme = Theme.getThemeFromSelectedTheme()
const { projects, hasError } = storeToRefs(useProjectStore())
const { hasSpinner } = storeToRefs(useNavigationStore())

const filteredProjects = ProjectFilter.filter(projects, theme)
const sortedProjects = ProjectSorter.sort(filteredProjects)
const projectList = computed(() => {
  return props.limit ? sortedProjects.value.slice(0, props.limit) : sortedProjects.value
})

const countProjects = computed(() => {
  return projectList.value.length
})

const hasNoResults = computed(() => {
  return hasSpinner.value || hasError.value || !countProjects.value
})
</script>
