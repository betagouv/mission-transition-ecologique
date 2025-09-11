<template>
  <LayoutCatalog
    :has-side-menu="hasSideMenu"
    :title="title"
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

const title = 'Les aides à la transition écologique'
const description =
  'Réalisez une recherche parmi les aides à la transition écologique des entreprises, proposées par l’ensemble des partenaires publics :' +
  'ADEME, Bpifrance, CCI, CMA, etc.'

onServerPrefetch(async () => {
  await new ProgramManager().getDependentCompanyData(false)
})

onNuxtReady(async () => {
  await new ProgramManager().getDependentCompanyData(true)
})

useSeoMeta(MetaSeo.get(title, description))
useSchemaOrg(defineWebPage({ description: description }))

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
