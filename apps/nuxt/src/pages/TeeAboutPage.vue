<template>
  <div>
    <TeeDsfrBreadcrumb :links="[{ text: 'Qui sommes nous ?', to: { name: RouteName.About } }]" />
    <div class="fr-container">
      <h1 class="fr-text--blue-france">Qui sommes-nous ?</h1>
      <TeeAboutIntro />
      <TeeAboutEntryPoint />
      <TeeAboutPartners />
      <TeeAboutStateStartup />
      <TeeAboutCompanies />
      <TeeAboutTheyTalkAboutUs />
    </div>
    <div class="fr-container-fluid fr-container-md">
      <TeeAboutTestimonies class="fr-bg--blue--lightness" />
    </div>
    <div class="fr-container">
      <TeeCtaCard
        title="<img src='/images/logos/tee-with-name.webp' alt='Transition écologique des entreprises'/>"
        description="Trouvez les aides adaptées pour financer la transition environnementale de votre entreprise et, en quelques clics, entrez en contact avec les bons interlocuteurs pour mener vos projets au succès."
        cta-btn-title="Trouver les aides pour mon entreprise"
        :on-click="goToCtaLink"
        :img-bg-color="Color.yellowLighted"
        object-fit="contain"
        :with-logo="false"
        class="fr-my-3w"
      />
      <TeeAboutOtherServices />
    </div>
  </div>
</template>

<script setup lang="ts">
// import { MetaSeo } from '@/tools/metaSeo'
import Navigation from '@/tools/navigation'
import { Color, RouteName } from '@/types'
import { MetaRobots } from '@/tools/metaRobots'
import { useRouter } from 'vue-router'

definePageMeta({
  path: '/qui-sommes-nous',
  name: RouteName.About
})

const navigation = new Navigation()

const router = useRouter()

const goToCtaLink = () => {
  router.push({
    name: RouteName.Homepage,
    query: { 'profil-entreprise': 'oui' }
  })
}

// const description = "TODO."
// useSeoMeta(MetaSeo.get('About-us', description))
// useSchemaOrg(defineWebPage({ description: description }))

useHead({
  link: [
    {
      rel: 'canonical',
      href: navigation.getHrefByRouteName(RouteName.About)
    }
  ],
  ...MetaRobots.indexFollow()
})
</script>
