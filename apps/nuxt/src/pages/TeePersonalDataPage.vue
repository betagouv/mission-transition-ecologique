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
import { RouteName } from '@/types'
import { PrivacyPolicyPropsCookie, PrivacyPolicyPropsThirdParty, PrivacyPolicy } from '@incubateur-ademe/legal-pages-vue3'

definePageMeta({
  path: '/donnees-personnelles',
  layout: 'default',
  name: RouteName.PersonalData
})

const thirdParties: PrivacyPolicyPropsThirdParty[] = [
  {
    name: 'Scalingo',
    country: 'France',
    hostingCountry: 'France',
    serviceType: 'Hébergement',
    policyUrl: 'https://scalingo.com/data-processing-agreement'
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
</script>
