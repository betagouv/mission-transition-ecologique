<template>
  <div>
    <ThemeFiltersAndCard
      v-if="!hasSpinner"
      :has-error="hasError"
    />
    <div class="fr-container fr-px-md-0 fr-pt-1v">
      <SimpleProjectList
        v-if="!hasSpinner"
        :project-list="projectList"
        title-project-tag="h4"
      />
    </div>
    <div
      v-if="hasSpinner"
      class="fr-col-justify--center fr-col-12"
    >
      <TeeSpinner class="fr-mt-16w" />
    </div>
    <TeeListNoResults
      v-else-if="hasNoResults"
      :has-error="hasError"
      message="Aucune idée d'action n'a pu être identifiée avec les critères choisis..."
      :count-items="countProjects"
    />
    <div class="fr-col-12 fr-col-justify--center fr-py-8v">
      <TeeButtonLink
        :to="{ name: RouteName.CatalogProjects }"
        icon="fr-icon-arrow-right-line"
        icon-right
        class="fr-border-b--blue-france fr-py-0"
      >
        Voir tous les projets
      </TeeButtonLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import ProjectFilter from '@/tools/project/projectFilter'
import { ProjectManager } from '@/tools/project/projectManager'
import { Theme } from '@/tools/theme'
import { CompanyData } from '@/tools/companyData'
import { RouteName, ProjectType } from '@/types'

interface Props {
  limit: number
}
const props = defineProps<Props>()

onServerPrefetch(async () => {
  await new ProjectManager().getProjects()
})

onNuxtReady(async () => {
  CompanyData.isDataFullComputed().value // call to initialize computed reactivity variable
  await new ProjectManager().getProjects()
})

const theme = Theme.getThemeFromSelectedTheme()
const { projects, hasError } = storeToRefs(useProjectStore())
const { hasSpinner } = storeToRefs(useNavigationStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())

const filteredProjects = ProjectFilter.filter(projects, theme)
const sortedProjects = computed(() => {
  if (!filteredProjects.value) {
    return []
  }

  if (!theme.value || !Theme.isTheme(theme.value)) {
    return isDataFull.value ? projects.value : byHighlight(filteredProjects.value)
  }

  return filteredProjects.value
})
const projectList = computed(() => {
  return props.limit ? sortedProjects.value.slice(0, props.limit) : sortedProjects.value
})

const countProjects = computed(() => {
  return projectList.value.length
})

const hasNoResults = computed(() => {
  return !hasSpinner.value && (hasError.value || !countProjects.value)
})

function byHighlight(projects: ProjectType[]): ProjectType[] {
  return projects.toSorted((a, b) => {
    if (!a.highlightPriority) {
      return 1
    }
    if (!b.highlightPriority) {
      return -1
    }
    return a.highlightPriority - b.highlightPriority
  })
}
</script>
