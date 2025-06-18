<script lang="ts" setup>
import Contact from '@/tools/contact'

import { FaqPage } from '@/tools/faq/faqType'
import { MetaSeo } from '@/tools/metaSeo'
import Navigation from '@/tools/navigation'
import { RouteName } from '@/types'

definePageMeta({
  name: RouteName.Faq
})

const { FaqJson } = await import('@/tools/faq/FaqJson')

const title = 'Questions fréquentes'

const description = 'Retrouvez les réponses aux questions les plus fréquentes sur Mission Transition Écologique des Entreprises.'
useSeoMeta(MetaSeo.get('Questions fréquentes', description))
useSchemaOrg(defineWebPage({ description: description, '@type': 'FAQPage' }))
</script>

<template>
  <Layout
    before-default-class="fr-container--fluid fr-container-md"
    :links="[{ text: title }]"
  >
    <template #beforeDefault>
      <div class="fr-grid-row fr-mb-4w">
        <div class="fr-container fr-grid-row fr-px-md-0">
          <div
            class="fr-col-12 fr-mt-3v fr-text-center fr-text-left-md fr-flex-direction--column"
            :class="Navigation.getClassesBySideMenu(true)"
          >
            <h1 class="fr-text--blue-france">{{ title }}</h1>
            <p>
              Bienvenue dans notre Foire aux Questions dédiée aux entreprises qui souhaitent engager leur transition écologique. Vous y
              trouverez des réponses claires aux interrogations les plus fréquentes sur les aides disponibles, les démarches à entreprendre,
              les outils à mobiliser et les services proposés sur la plateforme.
            </p>
            <p>
              🔍 Vous ne trouvez pas la réponse à votre question ?
              <a
                :href="Contact.mailTo"
                target="_blank"
                class="fr-icon-mail-line fr-icon--xs fr-btn--icon-right"
              >
                Contactez notre équipe
              </a>
            </p>
          </div>
        </div>
      </div>
    </template>
    <Faq :faq-items="FaqJson.pages[FaqPage.Faq]" />
  </Layout>
</template>
