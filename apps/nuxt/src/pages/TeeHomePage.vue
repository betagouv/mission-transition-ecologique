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
      <TeeHomeProjectList />
    </div>
    <TeeHomeTestimonies />
    <div class="fr-container--fluid fr-container-md">
      <TeePromises />
      <div class="fr-bg--blue--lightness fr-col-12 fr-py-0-5v fr-mt-8v fr-mb-8v"></div>
    </div>

    <template #faq>
      <div class="fr-container--fluid fr-container-md">
        <div class="fr-container fr-px-md-0">
          <h2 class="fr-text--blue-france fr-text-center fr-text-left-md fr-pt-6v fr-mb-2v">Questions fréquentes</h2>
          <p class="fr-text--blue-france fr-text-center fr-text-left-md fr-mb-8v">
            Trouvez ici des réponses concrètes sur les aides, démarches et outils pour réussir votre transition écologique.
          </p>
        </div>
        <LazyFaq
          :faq-items="faqHomeJson"
          class="fr-container fr-px-md-0"
        />
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { defineRouteRules } from '#imports'
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { MetaRobots } from '@/tools/metaRobots'
import Navigation from '@/tools/navigation'
import { FaqSectionType, RouteName } from '@/types'

const navigation = new Navigation()

const { default: json } = await import('@/public/json/faq/home.json')
const faqHomeJson = json as unknown as FaqSectionType[]

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
