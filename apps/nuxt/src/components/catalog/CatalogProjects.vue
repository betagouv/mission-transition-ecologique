<template>
  <CatalogLayout
    :title="title"
    :description="description"
    :has-error="hasError"
    :count-items="countProjects"
    :has-side-bar="hasFullRegisteredData"
  >
    <template
      v-if="hasFilteredProjects"
      #catalog-content
    >
      <div
        v-if="hasFullRegisteredData"
        class="fr-col-2 fr-col-hidden fr-col-unhidden-lg"
      >
        <div class="fr-sidemenu fr-pr-0 fr-mx-3v">
          <div class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w">Filtres</div>
          <ProjectFiltersAccordion />
        </div>
      </div>
      <div
        class="fr-col-12 fr-col-justify--center fr-pr-md-2v"
        :class="{
          'fr-col-md-10': hasFullRegisteredData,
          'fr-col-md-12': !hasFullRegisteredData
        }"
      >
        <div class="fr-container--fluid fr-mt-2v fr-mt-md-3v">
          <div class="fr-grid-row fr-grid-row--center">
            <div class="fr-pl-2v fr-pl-md-0 fr-col-3 fr-col-lg-12 fr-col-content--middle fr-text--blue-france tee-font-style--italic">
              <TeeCounterResult :to-count="filteredProjects" />
            </div>
            <div class="fr-col-9 fr-col-hidden-lg fr-text-right">
              <ProjectModalFilter />
            </div>
            <div class="fr-col-12 fr-mt-2v">
              <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-lg--left project-cards-container">
                <div
                  v-for="project in sortedProjects"
                  :key="project.id"
                  class="fr-col-12 fr-col-sm-6 fr-col-lg-4 no-outline"
                >
                  <ProjectCard
                    :project="project"
                    class="fr-radius-a--1v fr-card--shadow fr-enlarge-link"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CatalogLayout>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { ProjectManager } from '@/tools/project/projectManager'
import ProjectSorter from '@/tools/project/projectSorter'
import { MetaSeo } from '@/tools/metaSeo'
import { computed } from 'vue'
import { CompanyData } from '@/tools/companyData'

const projectStore = useProjectStore()

const { projects, hasError } = storeToRefs(projectStore)

onServerPrefetch(async () => {
  await new ProjectManager().getProjects()
})

onNuxtReady(async () => {
  await new ProjectManager().getProjects()
})

const title = 'Le catalogue des projets de transition écologique'
const description = 'Accédez à la liste des projets de transition écologique destinées aux entreprises.'

useSeoMeta(MetaSeo.get(title, description))

const filteredProjects = computed(() => {
  return projects.value ? projectStore.getProjectsByFilters(projects.value) : undefined
})

const sortedProjects = ProjectSorter.sort(filteredProjects)

const hasFullRegisteredData = CompanyData.isDataFull()

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
<style lang="scss" scoped>
.project-cards-container {
  padding: 0.2rem;
}
</style>
