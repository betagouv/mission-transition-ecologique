<template>
  <LayoutCatalog
    :has-side-menu="hasSideMenu"
    description="Explorez les projets de transition écologique et trouvez les aides publiques adaptées à votre entreprise,
      issues de l’ensemble des financeurs publics."
    :has-error="hasError"
    :count-items="countProjects"
    :faq-items="faqCatalogProject"
  >
    <template #title>
      <h1 class="fr-text--blue-900 fr-mb-0 fr-h2">
        Quelles aides pour concrétiser votre projet<span class="fr-display-xl--block"> de transition écologique&nbsp;?</span>
      </h1>
    </template>
    <template
      v-if="companyDataSelected && isDataFull"
      #beforeThemeFilter
    >
      <h2 class="fr-h3 fr-mt-2v fr-mb-0">Vous êtes éligible à {{ animatedCount }} {{ animatedCount > 1 ? 'aides' : 'aide' }}</h2>
    </template>
    <template #sidemenu>
      <ProjectFiltersAccordion with-title />
    </template>
    <SimpleProjectList
      :project-list="sortedProjects"
      :with-counter="!isDataFull"
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
import { useFiltersStore } from '@/stores/filters'
import { useProjectStore } from '@/stores/project'
import { CompanyData } from '@/tools/companyData'
import { MetaSeo } from '@/tools/metaSeo'
import Navigation from '@/tools/navigation'
import { ProgramManager } from '@/tools/program/programManager'
import ProjectFilter from '@/tools/project/projectFilter'
import { ProjectManager } from '@/tools/project/projectManager'
import { Theme } from '@/tools/theme'
import { FaqSectionType, RouteName } from '@/types'
import { computed } from 'vue'
import { MetaRobots } from '@/tools/metaRobots'
import { defineWebPage, useSchemaOrg } from '@unhead/schema-org/vue'

definePageMeta({
  name: RouteName.CatalogProjects,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

const { default: json } = await import('@/public/json/faq/catalog-project.json')
const faqCatalogProject = json as unknown as FaqSectionType[]

const { projects, hasError } = storeToRefs(useProjectStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())
const { companyDataSelected } = storeToRefs(useFiltersStore())
const theme = Theme.getThemeFromSelectedTheme()
const filteredProjects = ProjectFilter.filter(projects, theme)
const navigation = new Navigation()

const seoTitle = 'Projets écologiques en entreprise –  Exemples et opportunités'
const seoDescription =
  "Découvrez  les projets de transition écologique pour votre secteur d'activité : explications, ressources," +
  " témoignages d'entreprises et liste des aides financières associées."

await new ProjectManager().getProjects()

onNuxtReady(async () => {
  CompanyData.isDataFullComputed().value // call to initialize computed reactivity variable
  await new ProjectManager().getProjects()
  if (isDataFull) {
    await new ProgramManager().getDependentCompanyData(true)
  }
})

const { animatedCount } = useCounterProgramsAnimation()

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
