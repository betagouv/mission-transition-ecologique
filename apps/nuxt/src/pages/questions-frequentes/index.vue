<script lang="ts" setup>
import { useCompanyDataStore } from '@/stores/companyData'
import { CompanyData } from '@/tools/companyData'
import Contact from '@/tools/contact'
import { MetaSeo } from '@/tools/metaSeo'
import Navigation from '@/tools/navigation'
import { Color, RouteName, FaqPage } from '@/types'

const { FaqJson } = await import('@/tools/faq/FaqJson')

onNuxtReady(async () => {
  CompanyData.isDataFullComputed().value // call to initialize computed reactivity variable
})

definePageMeta({
  name: RouteName.Faq
})

const title = 'Questions fréquentes'
const description =
  'Découvrez la FAQ de la plateforme Transition Écologique : un service public gratuit pour aider les entreprises à trouver des aides et réussir leur transition écologique.'

const router = useRouter()
const { isDataFull } = storeToRefs(useCompanyDataStore())

const onClick = () => {
  if (isDataFull.value) {
    return router.push({
      name: RouteName.CatalogPrograms
    })
  } else {
    useNavigationStore().setFromCtaRegisterModal(true)
    Navigation.toggleRegisterModal()
  }
}

useSeoMeta(MetaSeo.get('Questions fréquentes', description))
useSchemaOrg(defineWebPage({ description: description }))
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
            class="fr-col-12 fr-mt-3v fr-text-left fr-flex-direction--column"
            :class="Navigation.getClassesBySideMenu(true)"
          >
            <h1 class="fr-text--blue-france">{{ title }}</h1>
            <p class="fr-text--blue-france">
              Bienvenue dans notre Foire aux Questions dédiée aux entreprises qui souhaitent engager leur transition écologique. Vous y
              trouverez des réponses claires aux interrogations les plus fréquentes sur les aides disponibles, les démarches à entreprendre,
              les outils à mobiliser et les services proposés sur la plateforme.
            </p>
            <p class="fr-text--blue-france">
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
    <div class="fr-bg--blue--lightness fr-col-12 fr-py-0-5v fr-mt-8v"></div>
    <template #bottom>
      <div class="fr-grid-row fr-mb-8v">
        <div
          class="fr-col-12"
          :class="Navigation.getClassesBySideMenu(true)"
        >
          <TeeCtaCard
            title="Accélérez votre transition avec la plateforme <i>Transition Écologique des Entreprises</i>."
            description="Trouvez les aides adaptées pour financer la transition environnementale de votre entreprise et, en quelques clics, entrez en contact avec les bons interlocuteurs pour mener vos projets au succès."
            cta-btn-title="Trouver les aides pour mon entreprise"
            :on-click="onClick"
            :img-bg-color="Color.purple"
            object-fit="contain"
          />
        </div>
      </div>
    </template>
  </Layout>
</template>
