<template>
  <LayoutCatalog
    :has-side-menu="hasSideMenu"
    title="Les projets de transition écologique"
    :has-error="hasError"
    :count-items="countProjects"
    :faq-items="faqCatalogProject"
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
import Navigation from '@/tools/navigation'
import ProjectFilter from '@/tools/project/projectFilter'
import { ProjectManager } from '@/tools/project/projectManager'
import { Theme } from '@/tools/theme'
import { FaqSectionType, RouteName } from '@/types'
import { computed } from 'vue'
import { MetaRobots } from '@/tools/metaRobots'

definePageMeta({
  name: RouteName.CatalogProjects,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

const { default: json } = await import('@/public/json/faq/catalog-project.json')
const faqCatalogProject = json as unknown as FaqSectionType[]

const { projects, hasError } = storeToRefs(useProjectStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())
const theme = Theme.getThemeFromSelectedTheme()
const filteredProjects = ProjectFilter.filter(projects, theme)
const navigation = new Navigation()

const seoTitle = 'Projets écologiques en entreprise –  Exemples et opportunités'
const seoDescription =
  "Découvrez  les projets de transition écologique pour votre secteur d'activité : explications, ressources," +
  " témoignages d'entreprises et liste des aides financières associées."

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

useSeoMeta(MetaSeo.get(seoTitle, seoDescription))
useSchemaOrg(defineWebPage({ description: seoDescription }))

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

const hasSideMenu = computed(() => {
  return !hasError.value && isDataFull.value
})

const countProjects = computed(() => {
  return filteredProjects.value?.length || 0
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: navigation.getHrefByRouteName(RouteName.CatalogProjects)
    }
  ],
  ...MetaRobots.noIndexOnQueries(useRoute().fullPath)
})
</script>
