<template>
  <LayoutCatalog
    :has-side-menu="hasSideMenu"
    title="Les aides à la transition écologique"
    :has-error="hasError"
    :count-items="countPrograms"
    :faq-page="FaqPage.CatalogProgram"
  >
    <template #sidemenu>
      <ProgramFiltersAccordion with-title />
    </template>
    <ProgramList :filtered-programs="filteredPrograms" />
  </LayoutCatalog>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { FaqPage } from '@/tools/faq/faqType'
import Navigation from '@/tools/navigation'
import { RouteName } from '@/types'
import { useProgramStore } from '@/stores/program'
import { ProgramManager } from '@/tools/program/programManager'
import { MetaSeo } from '@/tools/metaSeo'
import { computed } from 'vue'
import { MetaRobots } from '@/tools/metaRobots'

definePageMeta({
  name: RouteName.CatalogPrograms,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

const programStore = useProgramStore()
const { programs, hasError } = storeToRefs(useProgramStore())
const navigation = new Navigation()

const seoTitle = 'Aides aux entreprises et subventions dédiées à la transition écologique'
const seoDescription =
  'Trouvez les aides adaptées à votre entreprise : subvention, financements et accompagnements de l’ADEME, Bpifrance,' +
  ' CCI… pour votre transition énergétique et écologique.'

onServerPrefetch(async () => {
  await new ProgramManager().getDependentCompanyData(false)
})

onNuxtReady(async () => {
  await new ProgramManager().getDependentCompanyData(true)
})

useSeoMeta(MetaSeo.get(seoTitle, seoDescription))
useSchemaOrg(defineWebPage({ description: seoDescription }))

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

const hasSideMenu = computed(() => {
  return !hasError.value
})

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})

const countPrograms = computed(() => {
  return filteredPrograms.value?.length || 0
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: navigation.getHrefByRouteName(RouteName.CatalogPrograms)
    }
  ],
  ...MetaRobots.noIndexOnQueries(useRoute().fullPath)
})
</script>
