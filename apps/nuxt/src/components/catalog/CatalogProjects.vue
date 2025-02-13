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
        v-if="hasFullRegisteredData && props.showCompanyFilter"
        class="fr-col-2 fr-col-hidden fr-col-unhidden-lg"
      >
        <div class="fr-sidemenu fr-pr-0 fr-mx-3v">
          <div class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w">Filtres</div>
          <ProjectFiltersAccordion />
        </div>
      </div>
      <div
        class="fr-col-12 fr-col-justify--center fr-pr-md-2v"
        :class="hasFullRegisteredData ? 'fr-col-md-10' : 'fr-col-md-12'"
      >
        <div class="fr-mt-2v fr-mt-md-3v">
          <div class="fr-grid-row fr-grid-row--center">
            <div
              v-if="showCounter"
              class="fr-pl-2v fr-pl-md-0 fr-col-3 fr-col-lg-12 fr-col-content--middle fr-text--blue-france tee-font-style--italic"
            >
              <TeeCounterResult :to-count="filteredProjects" />
            </div>
            <div
              v-if="hasFullRegisteredData && props.showCompanyFilter"
              class="fr-col-9 fr-col-hidden-lg fr-text-right"
            >
              <ProjectModalFilter />
            </div>
            <SimpleProjectList :project-list="filteredProjects" />
          </div>
          <div class="fr-col-12 fr-mt-3v fr-mb-10v">
            <OtherProject />
          </div>
        </div>
      </div>
    </template>
  </CatalogLayout>
</template>

<script setup lang="ts">
import { useCompanyDataStore } from '@/stores/companyData'
import { useProjectStore } from '@/stores/project'
import { ProjectManager } from '@/tools/project/projectManager'
import { MetaSeo } from '@/tools/metaSeo'
import { computed } from 'vue'
import ProjectFilter from '@/tools/project/projectFilter'
import { Theme } from '@/tools/theme'
import { CompanyData } from '@/tools/companyData'

interface Props {
  showTitleBanner?: boolean
  showLimit?: number
  showCounter?: boolean
  showBreadcrumbs?: boolean
  showCompanyFilter?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  showTitleBanner: true,
  showLimit: undefined,
  showCounter: true,
  showBreadcrumbs: true,
  showCompanyFilter: true
})

const { projects, hasError } = storeToRefs(useProjectStore())
const { isDataFull: hasFullRegisteredData } = storeToRefs(useCompanyDataStore())

onServerPrefetch(async () => {
  await new ProjectManager().getProjects()
})

onNuxtReady(async () => {
  CompanyData.isDataFull().value // call to initialize computed reactivity variable
  await new ProjectManager().getProjects()
})

const title = 'Les projets de transition écologique'
const description = 'Accédez à la liste des projets de transition écologique destinées aux entreprises.'

const theme = Theme.getThemeFromSelectedTheme()

const filteredProjects = ProjectFilter.filter(projects, theme)
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
