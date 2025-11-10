<template>
  <div>
    <TeeDsfrBreadcrumb :links="[{ text: 'Données personnelles', to: RouteName.PersonalData }]" />
    <div class="fr-container fr-my-4w">
      <PrivacyPolicy
        date="17/06/2024"
        site-name="Mission Transition Écologique"
        :third-parties="thirdParties"
        :cookies="cookies"
        :cookie-consent-button="TeeFooterCookiesButton"
      />
    </div>
    <ContactMail />
  </div>
</template>

<script setup lang="ts">
import TeeFooterCookiesButton from '@/components/TeeFooterCookiesButton.vue'
import { MetaRobots } from '@/tools/metaRobots'
import { MetaSeo } from '@/tools/metaSeo'
import Navigation from '@/tools/navigation'
import { RouteName } from '@/types'
import { PrivacyPolicyPropsCookie, PrivacyPolicyPropsThirdParty, PrivacyPolicy } from '@incubateur-ademe/legal-pages-vue3'

definePageMeta({
  path: '/donnees-personnelles',
  name: RouteName.PersonalData
})

const navigation = new Navigation()

const thirdParties: PrivacyPolicyPropsThirdParty[] = [
  {
    name: 'Scalingo',
    country: 'France',
    hostingCountry: 'France',
    serviceType: 'Hébergement',
    policyUrl: 'https://scalingo.com/data-processing-agreement'
  },
  {
    name: 'Brevo',
    country: 'France',
    hostingCountry: 'France',
    serviceType: 'Gestion et diffusion des demandes',
    policyUrl: 'https://www.brevo.com/fr/legal/termsofuse/#accord-sur-le-traitement-des-donnees-a-caractere-personnel-dpa'
  },
  {
    name: 'Baserow',
    country: 'France',
    hostingCountry: 'Allemagne',
    serviceType: "Listing des référents internes aux dispositifs d'aides publiques et aux projets",
    policyUrl: 'https://baserow.io/privacy-policy'
  },
  {
    name: 'Conseillers-Entreprises',
    country: 'France',
    hostingCountry: 'France',
    serviceType: 'Traitement des demandes par les conseillers',
    policyUrl: 'https://conseillers-entreprises.service-public.gouv.fr/mentions_d_information'
  }
]

const cookies: PrivacyPolicyPropsCookie[] = [
  {
    category: 'Mesure d’audience anonymisée',
    name: 'Posthog',
    expiration: '13 mois',
    finalities: 'Mesure d’audience',
    editor: 'Posthog & ADEME',
    destination: 'Europe'
  }
]

const description = 'Informations relatives à la politique de confidentialité du site Mission Transition écologique des entreprises.'
useSeoMeta(MetaSeo.get('Politique de confidentialité', description))
useSchemaOrg(defineWebPage({ description: description }))

useHead({
  link: [
    {
      rel: 'canonical',
      href: navigation.getHrefByRouteName(RouteName.PersonalData)
    }
  ],
  ...MetaRobots.indexFollow()
})
</script>
