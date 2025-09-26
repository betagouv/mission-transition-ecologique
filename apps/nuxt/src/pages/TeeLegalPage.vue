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
import { MetaSeo } from '@/tools/metaSeo'
import Navigation from '@/tools/navigation'
import { RouteName } from '@/types/routeType'
import Contact from '@/tools/contact'
import { LegalNoticePropsThirdParty, LegalNotice } from '@incubateur-ademe/legal-pages-vue3'
import { MetaRobots } from '@/tools/metaRobots'

definePageMeta({
  path: '/mentions-legales',
  name: RouteName.Legal
})

const privacyPolicy = useRouter().resolve({ name: RouteName.PersonalData }).href
const siteUrl = useRouter().resolve({ name: RouteName.Homepage }).href
const navigation = new Navigation()

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

const description = 'Informations relatives aux mentions légales du site Mission Transition Écologique des Entreprises.'
useSeoMeta(MetaSeo.get('Mentions légales', description))
useSchemaOrg(defineWebPage({ description: description }))

useHead({
  link: [
    {
      rel: 'canonical',
      href: navigation.getHrefByRouteName(RouteName.Legal)
    }
  ],
  ...MetaRobots.indexFollow()
})
</script>
