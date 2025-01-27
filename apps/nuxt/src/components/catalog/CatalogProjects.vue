<template>
  <TeeDsfrBreadcrumb v-if="showBreadcrumbs" />
  <div class="fr-container fr-mt-6v">
    <div
      v-if="showTitle"
      class="fr-col-10 fr-col-lg-8"
    >
      <h1 class="fr-text--blue-france">{{ title }}</h1>
    </div>
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
          <div
            v-if="showCounter"
            class="fr-col-12 fr-text--blue-france tee-font-style--italic fr-mt-3v"
          >
            <TeeCounterResult :to-count="filteredProjects" />
          </div>
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--left fr-mt-0">
            <div
              v-for="project in projectList"
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
import Navigation from '@/tools/navigation'
import { ProjectManager } from '@/tools/project/projectManager'
import ProjectFilter from '@/tools/project/projectFilter'
import ProjectSorter from '@/tools/project/projectSorter'
import { ThemeId } from '@/types'
import { MetaSeo } from '@/tools/metaSeo'
import { computed } from 'vue'
import { Theme } from '@/tools/theme'

const programStore = useProgramStore()
const navigationStore = useNavigationStore()
interface Props {
  showTitle?: boolean
  showLimit?: number
  showCounter?: boolean
  showBreadcrumbs?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  showTitle: true,
  showLimit: undefined,
  showCounter: true,
  showBreadcrumbs: true
})
const { projects, hasError } = storeToRefs(useProjectStore())
const questionnaireData = useUsedTrackStore().getQuestionnaireData()

await new ProjectManager().getProjects(questionnaireData)

const title = 'Les projets de transition écologique'
const description = 'Accédez à la liste des projets de transition écologique destinées aux entreprises.'

if (!new Navigation().isHomepage()) {
  useSeoMeta(MetaSeo.get(title, description))
}

const theme = Theme.getThemeFromSelectedTheme()

const filteredProjects = ProjectFilter.filter(projects, theme)
const sortedProjects = ProjectSorter.sort(filteredProjects)

const hasSpinner = computed(() => {
  return navigationStore.hasSpinner
})

const projectList = computed(() => {
  return props.showLimit !== undefined ? sortedProjects.value.slice(0, props.showLimit) : sortedProjects.value
})
console.log(projectList.value)
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

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})
</script>
