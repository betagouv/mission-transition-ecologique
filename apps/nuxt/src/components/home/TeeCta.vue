<template>
  <div class="fr-container fr-py-7v fr-px-6v">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col fr-col-md-8 fr-col-lg-8">
        <div class="fr-grid-row">
          <div class="fr-col-12">
            <div class="fr-grid-row">
              <div class="fr-col-12">
                <p class="fr-text--purple fr-h4 fr-text--bold fr-mb-0">TPE, PME</p>
                <h1 class="fr-mb-3v">
                  Trouvez les aides pour
                  <span class="fr-display-md--block">la transition écologique </span>
                  <span class="fr-display-md--block">de votre entreprise</span>
                </h1>
              </div>
              <div class="fr-col-12 fr-col-lg-9">
                <h2 class="fr-text--lg fr-text--regular">
                  Identifiez facilement les aides publiques adaptées
                  <span class="fr-display-md--block">à votre entreprise pour concrétiser vos projets</span>
                  <span class="fr-display-md--block"> de transition écologique.</span>
                </h2>
              </div>
            </div>
          </div>
          <div class="fr-col-lg-8 fr-col-md-10 fr-col-sm-12 fr-col-xs-12 tee-home-cta-btn">
            <TeeDsfrButton
              size="lg"
              class="inline-flex fr-text--yellow fr-text--bold fr-text-xl fr-btn-fullwidth fr-btn-align-center"
              @click="toQuestionnaire()"
            >
              <template #default>
                Je trouve les aides <span class="fr-display--block fr-display-sm--inline">pour mon projet</span>
              </template>
            </TeeDsfrButton>
          </div>
        </div>
      </div>
      <div class="fr-col-2 fr-col-md-4 fr-col--middle fr-col-lg-4 tee-track-image-right fr-col-unhidden-md fr-col-hidden">
        <img
          class="fr-responsive-img"
          :src="img('/images/TEE-illustrationHP.png', { format: 'webp', densities: 1, quality: 70, loading: 'lazy' })"
          alt="Illustration de la page d'accueil - Une maison avec une éolienne, une ampoule et une prise électrique"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCompanyDataStore } from '@/stores/companyData'
import { Image } from '@/tools/image'
import { RouteName } from '@/types/routeType'
import Navigation from '@/tools/navigation'

const router = useRouter()
const { isDataFull } = storeToRefs(useCompanyDataStore())
const img = Image.getUrl

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
<style scoped lang="scss">
.tee-track-image-right > .fr-responsive-img {
  max-height: 350px;
  width: auto;
}
</style>
