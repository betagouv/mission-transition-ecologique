<template>
  <!-- MAIN APP COMPONENT  -->
  <Layout
    :breadcrumb="false"
    fluid
  >
    <template #top>
      <div class="fr-bg--blue--lightness">
        <TeeCta />
      </div>
    </template>

    <div class="fr-container--fluid fr-container-md">
      <h2 class="fr-text--blue-france fr-text-center fr-text-left-md fr-pt-6v">Quel est votre projet ?</h2>
      <TeeHomeProjectList :limit="filters[FilterItemKeys.themeType] === '' ? 8 : 9" />
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-bg--blue--lightness fr-hidden fr-unhidden-sm fr-col-12 fr-py-0-5v fr-my-8v"></div>
      </div>
      <TeePromises />
    </div>

    <template #faq>
      <div class="fr-container--fluid fr-container-md">
        <h2 class="fr-text--blue-france fr-text-center fr-text-left-md fr-pt-6v">Questions fréquentes</h2>
        <Faq
          :faq-items="FaqJson.pages[FaqPage.Home]"
          class="fr-container fr-px-md-0"
        />
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { defineRouteRules } from '#imports'
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { FaqPage } from '@/tools/faq/faqType'
import { MetaRobots } from '@/tools/metaRobots'
import Navigation from '@/tools/navigation'
import { FilterItemKeys, RouteName } from '@/types'

const { filters } = storeToRefs(useFiltersStore())
const navigation = new Navigation()
const { FaqJson } = await import('@/tools/faq/FaqJson')

definePageMeta({
  path: '/',
  name: RouteName.Homepage,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetFilters]
})

defineRouteRules({
  sitemap: {
    priority: 1.0,
    changefreq: 'weekly'
  }
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: navigation.getHrefByRouteName(RouteName.Homepage)
    }
  ],
  ...MetaRobots.indexFollow()
})
</script>
