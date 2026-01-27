<template>
  <LayoutCatalog
    :has-side-menu="hasSideMenu"
    description="Accédez à l’ensemble des aides publiques pour vous permettre d’engager la transition écologique de votre entreprise :
      aides financières, accompagnements, formations, prêts, avantages fiscaux..."
    :has-error="hasError"
    :count-items="countPrograms"
    :faq-items="faqCatalogProgram"
  >
    <template #title>
      <h1 class="fr-text--blue-900 fr-mb-0">Le catalogue des aides<span class="fr-display-xl--block"> à la transition écologique</span></h1>
    </template>
    <template #sidemenu>
      <ProgramFiltersAccordion with-title />
    </template>
    <ProgramList :filtered-programs="programsByFilters" />
  </LayoutCatalog>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import Navigation from '@/tools/navigation'
import { FaqSectionType, RouteName } from '@/types'
import { useProgramStore } from '@/stores/program'
import { ProgramManager } from '@/tools/program/programManager'
import { MetaSeo } from '@/tools/metaSeo'
import { computed, onMounted } from 'vue'
import { MetaRobots } from '@/tools/metaRobots'
import { defineWebPage, useSchemaOrg } from '@unhead/schema-org/vue'
import { useRoute } from 'vue-router'
import { Scroll } from '@/tools/scroll/scroll'

definePageMeta({
  name: RouteName.CatalogPrograms,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

const { default: json } = await import('@/public/json/faq/catalog-program.json')
const faqCatalogProgram = json as unknown as FaqSectionType[]

const { hasError, programsByFilters } = storeToRefs(useProgramStore())
const navigation = new Navigation()
const route = useRoute()

const seoTitle = 'Aides aux entreprises et subventions dédiées à la transition écologique'
const seoDescription =
  'Trouvez les aides adaptées à votre entreprise : subvention, financements et accompagnements de l’ADEME, Bpifrance,' +
  ' CCI… pour votre transition énergétique et écologique.'

await new ProgramManager().getDependentCompanyData(false)

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

const countPrograms = computed(() => {
  return programsByFilters.value.length || 0
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

onMounted(() => {
  if (!route.hash) {
    return
  }

  Scroll.toHashWithRetries(route.hash)
})
</script>
