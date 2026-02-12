<template>
  <!-- MAIN APP COMPONENT  -->
  <Layout
    :breadcrumb="false"
    fluid
  >
    <template #top>
      <div class="fr-bg--green--lightness">
        <TeeCta
          overline="Entreprises & associations"
          @on-click-button="toQuestionnaire"
        />
      </div>
    </template>

    <div class="fr-container--fluid fr-container-md">
      <h2 class="fr-text--blue-900 fr-text-center fr-text-left-md fr-pt-6v">
        <template v-if="!isDataFull">Quel est votre projet ?</template>
        <template v-else> Vous êtes éligible à {{ animatedCount }} {{ animatedCount > 1 ? 'aides' : 'aide' }} </template>
      </h2>

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
          <h2 class="fr-text--blue-900 fr-text-center fr-text-left-md fr-pt-6v fr-mb-2v">Questions fréquentes</h2>
          <p class="fr-text--blue-900 fr-text-center fr-text-left-md fr-mb-8v">
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
import { useCompanyDataStore } from '@/stores/companyData'

const navigation = new Navigation()
const router = useRouter()
const { isDataFull } = storeToRefs(useCompanyDataStore())

const { default: json } = await import('@/public/json/faq/home.json')
const faqHomeJson = json as unknown as FaqSectionType[]

const { animatedCount } = useCounterProgramsAnimation()

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

const toQuestionnaire = async () => {
  if (isDataFull.value) {
    await router.push({
      name: RouteName.CatalogProjects
    })
  } else {
    useNavigationStore().setFromCtaRegisterModal(true)
    Navigation.toggleRegisterModal()
  }
}

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
