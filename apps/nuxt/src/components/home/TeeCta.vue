<template>
  <div class="fr-container fr-py-7v fr-px-6v tee-cta-image">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col fr-col-md-8 fr-col-lg-8">
        <div class="fr-grid-row">
          <div class="fr-col-12">
            <div class="fr-grid-row">
              <div class="fr-col-12">
                <p class="fr-text--purple fr-h4 fr-text--bold fr-mb-2v fr-text--blue-agir">Entreprises & associations</p>
                <h1 class="fr-mb-6v fr-text--blue-900">
                  Découvrez vos aides éligibles
                  <span class="fr-display-lg--block">parmi <span class="fr-text--green-agir">tous les financeurs publics</span></span>
                  <!--                                    la transition écologique </span>-->
                  <!--                  <span class="fr-display-md&#45;&#45;block">de votre entreprise</span>-->
                </h1>
              </div>
              <div class="fr-col-12 fr-col-lg-9">
                <h2 class="fr-text--lg fr-text--regular fr-text--blue-900">
                  Identifiez facilement les aides publiques adaptées à votre entreprise
                  <span class="fr-display-lg--block"> pour concrétiser vos projets de transition écologique.</span>
                </h2>
              </div>
            </div>
          </div>
          <div class="fr-col-lg-8 fr-col-md-10 fr-col-sm-12 fr-col-xs-12 tee-home-cta-btn">
            <TeeDsfrButton
              size="lg"
              class="inline-flex fr-text--bold fr-text-xl fr-btn-fullwidth fr-btn-align-center fr-btn-bg fr-btn-bg--blue-agir"
              only-label="Je trouve les aides pour mon projet"
              @click="toQuestionnaire()"
            >
              Je trouve les aides <span class="fr-display--block fr-display-sm--inline">pour mon projet</span>
            </TeeDsfrButton>
          </div>
        </div>
      </div>
      <div class="fr-col-2 fr-col-md-4 fr-col--middle fr-col-lg-4 fr-col-unhidden-md fr-col-hidden"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCompanyDataStore } from '@/stores/companyData'
import { RouteName } from '@/types/routeType'
import Navigation from '@/tools/navigation'

const router = useRouter()
const { isDataFull } = storeToRefs(useCompanyDataStore())

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
</script>
