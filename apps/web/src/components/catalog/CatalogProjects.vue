<template>
  <CatalogBanner>
    <template #title> Le catalogue des projets de transition écologique </template>
    <template #description> Accédez à la liste des projets de transition écologique destinées aux entreprises. </template>
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
          class="fr-col-12 fr-mt-3v"
          :objective="objective as Objective"
          radius-corner="tr"
          radius-size="2-5v"
        />
        <div v-if="hasFilteredProjects">
          <div class="fr-col-12 fr-mt-3v">
            <h2 class="fr-text--bold fr-mb-0">Quel est votre projet ?</h2>
          </div>
          <div class="fr-col-12 fr-text--blue-france tee-font-style--italic fr-mt-3v">
            <TeeCounterResult :to-count="filteredProjects" />
          </div>
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--left fr-mt-3v">
            <router-link
              v-for="project in filteredProjects"
              :id="project.slug"
              :key="project.id"
              :to="getRouteToProjectDetail(project)"
              class="fr-col-12 fr-col-sm-6 fr-col-md-6 fr-col-lg-4 no-outline"
            >
              <ProjectCard
                :project="project"
                class="fr-radius-a--1v fr-card--shadow"
              />
            </router-link>
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
import { Objective, type ProgramData, Project as ProjectType, RouteName, TrackId } from '@/types'
import Contact from '@/utils/contact'
import Matomo from '@/utils/matomo'
import { Project } from '@/utils/project/project'
import { computed, onBeforeMount } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const projectStore = useProjectStore()
const programStore = useProgramStore()
const navigationStore = useNavigationStore()

const projects = ref<ProjectType[]>()
const programs = ref<ProgramData[]>()
const hasError = ref<boolean>(false)

const objective = computed(() => {
  return programStore.hasObjectiveTypeSelected() ? (programStore.programFilters.objectiveTypeSelected as Objective) : ''
})

const filteredProjects = Project.filter(projects, programs, objective)

const hasSpinner = computed(() => {
  return navigationStore.hasSpinner
})

const hasThemeCard = computed(() => {
  return programStore.hasObjectiveTypeSelected() && !hasSpinner.value
})

const hasFilteredProjects = computed(() => {
  return filteredProjects.value?.length
})

const getRouteToProjectDetail = (project: ProjectType): RouteLocationRaw => {
  return {
    name: RouteName.CatalogProjectDetail,
    params: { projectSlug: project.slug }
  }
}

onBeforeMount(async () => {
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
  Matomo.sendEvent(TrackId.Results, 'show_results_catalog_projects')
})
</script>
