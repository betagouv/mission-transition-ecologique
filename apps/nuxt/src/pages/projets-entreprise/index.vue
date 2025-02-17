<template>
  <Layout before-default-class="fr-container--fluid fr-container-md">
    <template #beforeDefault>
      <div class="fr-grid-row">
        <div class="fr-container fr-grid-row fr-px-md-0">
          <div
            class="fr-col-12 fr-mt-3v fr-text-center fr-text-left-md"
            :class="lineClassBySideMenu"
          >
            <h1 class="fr-text--blue-france">{{ title }}</h1>
          </div>
        </div>
        <div
          v-if="!hasError"
          class="fr-col-12 fr-mt-3v"
          :class="lineClassBySideMenu"
        >
          <ThemeFilter />
        </div>
      </div>
      <div
        v-if="!hasError"
        class="fr-grid-row"
      >
        <div
          class="fr-col-12"
          :class="lineClassBySideMenu"
        >
          <ThemeHeaderCard
            v-if="hasThemeCard"
            :theme="theme as ThemeId"
            radius-corner="tr"
            radius-size="2-5v"
          />
        </div>
      </div>
    </template>
    <template
      v-if="!hasSideMenu"
      #sidemenu
    >
      <ProjectFiltersAccordion with-title />
    </template>
    <SimpleProjectList
      :project-list="filteredProjects"
      with-counter-and-modal-filter
    />
    <div class="fr-col-12 fr-mt-3v fr-mb-10v">
      <OtherProject />
    </div>
    <div
      v-if="hasSpinner"
      class="fr-col-12 fr-col-justify--center"
    >
      <TeeSpinner class="fr-my-16w" />
    </div>
    <TeeListNoResults
      v-else-if="hasNoResultsOrError"
      :has-error="hasError && !hasSpinner"
      message="Aucune idée d'action n'a pu être identifiée avec les critères choisis..."
      :count-items="countProjects"
    />
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { useCompanyDataStore } from '@/stores/companyData'
import { useFiltersStore } from '@/stores/filters'
import { useNavigationStore } from '@/stores/navigation'
import { useProjectStore } from '@/stores/project'
import { CompanyData } from '@/tools/companyData'
import { MetaSeo } from '@/tools/metaSeo'
import ProjectFilter from '@/tools/project/projectFilter'
import { ProjectManager } from '@/tools/project/projectManager'
import { Theme } from '@/tools/theme'
import { RouteName, ThemeId } from '@/types'
import { computed } from 'vue'

definePageMeta({
  name: RouteName.CatalogProjects,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

const filtersStore = useFiltersStore()
const { projects, hasError } = storeToRefs(useProjectStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())
const { hasSpinner } = storeToRefs(useNavigationStore())
const theme = Theme.getThemeFromSelectedTheme()
const filteredProjects = ProjectFilter.filter(projects, theme)

const title = 'Les projets de transition écologique'
const description = 'Accédez à la liste des projets de transition écologique destinées aux entreprises.'

onServerPrefetch(async () => {
  await new ProjectManager().getProjects()
})

onNuxtReady(async () => {
  CompanyData.isDataFull().value // call to initialize computed reactivity variable
  await new ProjectManager().getProjects()
})

useSeoMeta(MetaSeo.get(title, description))

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

const hasSideMenu = computed(() => {
  return hasError.value || !isDataFull.value
})

const lineClassBySideMenu = computed(() => {
  return hasSideMenu.value
    ? ''
    : 'fr-col-offset-md-3 fr-col-md-9 fr-col-justify-md--left fr-col-offset-lg-2 fr-col-lg-10 fr-col-justify--center'
})

const hasThemeCard = computed(() => {
  return filtersStore.hasThemeTypeSelected()
})

const countProjects = computed(() => {
  return filteredProjects.value?.length || 0
})

const hasFilteredProjects = computed(() => {
  return filteredProjects.value?.length
})

const hasNoResultsOrError = computed(() => {
  return !hasSpinner.value && (hasError.value || !hasFilteredProjects.value)
})
</script>
