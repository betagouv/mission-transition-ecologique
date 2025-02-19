<template>
  <div>
    <TeeDsfrBreadcrumb :links="[{ text: 'Mentions légales', to: { name: RouteName.Legal } }]" />
    <div class="fr-container fr-my-4w">
      <LegalNotice
        licence-url="https://github.com/betagouv/mission-transition-ecologique/blob/main/LICENSE"
        :privacy-policy-url="privacyPolicy"
        :site-url="siteUrl"
        :site-host="{
          address: '13 rue Jacques Peirotes 67000 Strasbourg',
          country: 'France',
          email: 'hello@scalingo.com',
          name: 'Scalingo'
        }"
        site-name="Mission Transition Écologique"
        date="17/06/2024"
        :third-parties="thirdParties"
        :contact-email="Contact.email"
        :include-beta-gouv="true"
      />
    </div>
    <ContactMail />
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/types/routeType'
import Contact from '@/tools/contact'
import { LegalNoticePropsThirdParty, LegalNotice } from '@incubateur-ademe/legal-pages-vue3'

definePageMeta({
  path: '/mentions-legales',
  name: RouteName.Legal
})
const navigationStore = useNavigationStore()
const privacyPolicy = navigationStore.resolveUrl({ name: RouteName.PersonalData }).href
const siteUrl = navigationStore.resolveUrl({ name: RouteName.Homepage }).href

const thirdParties: LegalNoticePropsThirdParty[] = [
  {
    name: 'API recherche entreprise',
    url: 'https://api.gouv.fr/les-api/api-recherche-entreprises',
    text: "La recherche d'entreprise est effectuée via l'"
  },
  {
    name: 'API Sirene',
    url: 'https://api.gouv.fr/les-api/sirene_v3',
    text: "Les données sont ensuite précisées via l'"
  }
]
</script>
