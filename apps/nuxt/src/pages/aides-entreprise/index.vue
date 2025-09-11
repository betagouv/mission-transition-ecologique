<template>
  <LayoutCatalog
    :has-side-menu="hasSideMenu"
    title="Les aides à la transition écologique"
    :has-error="hasError"
    :count-items="countPrograms"
    :faq-items="faqCatalogProgram"
  >
    <template #sidemenu>
      <ProgramFiltersAccordion with-title />
    </template>
    <ProgramList :filtered-programs="filteredPrograms" />
  </LayoutCatalog>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import Navigation from '@/tools/navigation'
import { FaqSectionType, RouteName } from '@/types'
import { useProgramStore } from '@/stores/program'
import { ProgramManager } from '@/tools/program/programManager'
import { MetaSeo } from '@/tools/metaSeo'
import { computed } from 'vue'
import { MetaRobots } from '@/tools/metaRobots'

definePageMeta({
  name: RouteName.CatalogPrograms,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

const { default: json } = await import('@tee/data/static/frontend/faq/catalog-program.json')
const faqCatalogProgram = json as unknown as FaqSectionType[]

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
