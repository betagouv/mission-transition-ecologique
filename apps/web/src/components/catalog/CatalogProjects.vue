<template>
  <TeeDsfrBreadcrumb v-if="showBreadcrumbs" />
  <CatalogBanner v-if="showTitle">
    <template #title> {{ title }} </template>
  </CatalogBanner>

  <div class="fr-container fr-mt-6v">
    <div class="fr-grid-row fr-grid-row--center">
      <div>
        <div class="fr-col-12 fr-col-justify--left fr-mt-3v">
          <ThemeFilter />
        </div>
        <ThemeHeaderCard
          v-if="hasThemeCard"
          class="fr-col-12"
          :theme="theme as ThemeId"
          radius-corner="tr"
          radius-size="2-5v"
        />
        <div v-if="hasFilteredProjects">
          <div class="fr-col-12 fr-text--blue-france tee-font-style--italic fr-mt-3v">
            <TeeCounterResult :to-count="filteredProjects" />
          </div>
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--left fr-mt-0">
            <div
              v-for="project in sortedProjects"
              :key="project.id"
              class="fr-col-12 fr-col-sm-6 fr-col-md-6 fr-col-lg-4 no-outline"
            >
              <ProjectCard
                :project="project"
                class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
              />
            </div>
          </div>
        </div>
        <div
          v-if="hasSpinner"
          class="fr-col-12 fr-col-justify--center fr-col-content--middle"
        >
          <TeeSpinner class="fr-mt-16w" />
        </div>
        <TeeListNoResults
          v-else-if="showNoResultsComponent"
          :has-error="hasError"
          message="Aucune idée d'action n'a pu être identifiée avec les critères choisis..."
          :count-items="countProjects"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { useProjectStore } from '@/stores/project'
import { Project as ProjectType, ThemeId } from '@/types'
import { MetaSeo } from '@/utils/metaSeo'
import { Project } from '@/utils/project/project'
import { computed, onBeforeMount } from 'vue'
import { Theme } from '@/utils/theme'

const projectStore = useProjectStore()
const programStore = useProgramStore()
const navigationStore = useNavigationStore()
interface Props {
  showTitle: boolean
  showBreadcrumbs: boolean
}
withDefaults(defineProps<Props>(), {
  showTitle: true,
  showBreadcrumbs: true
})
const projects = ref<ProjectType[]>()
const hasError = ref<boolean>(false)

const title = 'Les projets de transition écologique'

const theme = Theme.getThemeFromSelectedTheme()

const filteredProjects = Project.filter(projects, theme)
const sortedProjects = Project.sort(filteredProjects)

const hasSpinner = computed(() => {
  return navigationStore.hasSpinner
})

const hasThemeCard = computed(() => {
  return programStore.hasThemeTypeSelected() && !hasSpinner.value
})

const showNoResultsComponent = computed(() => {
  return hasSpinner.value || hasError.value || !countProjects.value
})

const countProjects = computed(() => {
  return filteredProjects.value?.length || 0
})

const hasFilteredProjects = computed(() => {
  return filteredProjects.value?.length
})

onBeforeMount(async () => {
  useSeoMeta(MetaSeo.get(title))

  navigationStore.hasSpinner = true
  const projectResult = await projectStore.projects
  if (projectResult.isOk) {
    projects.value = projectResult.value
  } else {
    hasError.value = true
  }

  navigationStore.hasSpinner = false
})

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})
</script>
