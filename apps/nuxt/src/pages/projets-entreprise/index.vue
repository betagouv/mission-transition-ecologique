<template>
  <LayoutCatalog
    :has-side-menu="hasSideMenu"
    :title="title"
    :has-error="hasError"
    :count-items="countProjects"
  >
    <template #sidemenu>
      <ProjectFiltersAccordion with-title />
    </template>
    <SimpleProjectList
      :project-list="sortedProjects"
      with-counter
      :with-modal-filter="hasSideMenu"
    />
    <div class="fr-col-12 fr-mt-3v fr-mb-10v">
      <OtherProject />
    </div>
  </LayoutCatalog>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { useCompanyDataStore } from '@/stores/companyData'
import { useProjectStore } from '@/stores/project'
import { CompanyData } from '@/tools/companyData'
import { MetaSeo } from '@/tools/metaSeo'
import ProjectFilter from '@/tools/project/projectFilter'
import { ProjectManager } from '@/tools/project/projectManager'
import { Theme } from '@/tools/theme'
import { RouteName } from '@/types'
import { computed } from 'vue'
import { MetaRobots } from '@/tools/metaRobots'

definePageMeta({
  name: RouteName.CatalogProjects,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

const { projects, hasError } = storeToRefs(useProjectStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())
const theme = Theme.getThemeFromSelectedTheme()
const filteredProjects = ProjectFilter.filter(projects, theme)

const title = 'Les projets de transition écologique'
const description = 'Accédez à la liste des projets de transition écologique destinées aux entreprises.'

onServerPrefetch(async () => {
  await new ProjectManager().getProjects()
})

onNuxtReady(async () => {
  CompanyData.isDataFullComputed().value // call to initialize computed reactivity variable
  await new ProjectManager().getProjects()
})

const sortedProjects = computed(() => {
  if (!filteredProjects.value) {
    return []
  }

  return filteredProjects.value
})

useSeoMeta(MetaSeo.get(title, description))

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

const hasSideMenu = computed(() => {
  return !hasError.value && isDataFull.value
})

const countProjects = computed(() => {
  return filteredProjects.value?.length || 0
})

useHead(MetaRobots.noIndexOnQueries(useRoute().fullPath))
</script>
