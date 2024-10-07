<template>
  <TeeDsfrBreadcrumb />
  <CatalogBanner>
    <template #title> {{ title }} </template>
    <template #description> {{ description }} </template>
  </CatalogBanner>

  <div class="fr-container fr-mt-6v">
    <div
      class="fr-grid-row"
      :class="{ 'fr-grid-row--center': hasSpinner }"
    >
      <TeeSpinner
        v-if="hasSpinner"
        class="fr-grid-row--center"
        scale="6"
      />
      <TeeError
        v-else-if="hasError"
        :mailto="Contact.email"
        :email="Contact.email"
      />
      <div v-else>
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
        <TeeNoResult
          v-else
          message="Aucun projet n'a pu être identifiée avec les critères choisis..."
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { useProjectStore } from '@/stores/project'
import { type ProgramData, Project as ProjectType, TrackId, ThemeId } from '@/types'
import Contact from '@/utils/contact'
import Analytics from '@/utils/analytic/analytics'
import { MetaSeo } from '@/utils/metaSeo'
import { Project } from '@/utils/project/project'
import { computed, onBeforeMount } from 'vue'
import { Theme } from '@/utils/theme'

const projectStore = useProjectStore()
const programStore = useProgramStore()
const navigationStore = useNavigationStore()

const projects = ref<ProjectType[]>()
const programs = ref<ProgramData[]>()
const hasError = ref<boolean>(false)

const title = 'Le catalogue des projets de transition écologique'
const description = 'Accédez à la liste des projets de transition écologique destinées aux entreprises.'

const theme = Theme.getThemeFromSelectedTheme()

const filteredProjects = Project.filter(projects, programs, theme)
const sortedProjects = Project.sort(filteredProjects)

const hasSpinner = computed(() => {
  return navigationStore.hasSpinner
})

const hasThemeCard = computed(() => {
  return programStore.hasThemeTypeSelected() && !hasSpinner.value
})

const hasFilteredProjects = computed(() => {
  return filteredProjects.value?.length
})

onBeforeMount(async () => {
  useSeoMeta(MetaSeo.get(title, description))

  navigationStore.hasSpinner = true
  const programResult = await programStore.programs
  const projectResult = await projectStore.projects
  if (programResult.isOk && projectResult.isOk) {
    programs.value = programResult.value
    projects.value = projectResult.value
  } else {
    hasError.value = true
  }

  navigationStore.hasSpinner = false

  // analytics / send event
  Analytics.sendEvent(TrackId.Results, 'show_results_catalog_projects')
})

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})
</script>
