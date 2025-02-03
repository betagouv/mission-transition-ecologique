<template>
  <div
    id="track_needs"
    class="fr-grid-row"
  >
    <div class="fr-col fr-col-md-8 fr-col-lg-8">
      <div class="fr-grid-row fr-grid-row--gutters fr-p-5v fr-p-sm-8v fr-p-md-20v">
        <div class="fr-col-12 fr-mb-4v fr-mx-0 fr-px-4v">
          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col">
              <h3 class="fr-text--purple fr-text--bold fr-mb-6v">TPE, PME</h3>
              <h1 class="fr-mb-3v">
                Trouvez les solutions pour
                <span class="fr-display-sm--block">la transition écologique </span>
                <span class="fr-display-sm--block">de votre entreprise</span>
              </h1>
              <p class="fr-text--lead fr-col-12 fr-col-lg-9 fr-pr-2v">
                Identifiez facilement les aides publiques adaptées à votre entreprise pour concrétiser vos projets de transition écologique.
              </p>
            </div>
          </div>
        </div>
        <div class="fr-col-xl-8 fr-col-lg-10 fr-col-md-10 fr-col-sm-12 fr-col-xs-12 tee-home-cta-btn">
          <TeeDsfrButton
            label="Je trouve les aides pour mon projet"
            size="lg"
            class="inline-flex fr-text--yellow fr-text--bold fr-text-xl fr-btn-fullwidth fr-btn-align-center"
            @click="toQuestionnaire()"
          />
        </div>
      </div>
    </div>
    <div class="fr-col-2 fr-col-md-4 fr-col-lg-4 tee-track-image-right fr-sm-hide">
      <img
        class="fr-responsive-img"
        src="/images/TEE-illustrationHP.png"
        alt="image / callout"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { CompanyData } from '@/tools/companyData'
import { RouteName } from '@/types/routeType'
import Navigation from '@/tools/navigation'

const router = useRouter()

const toQuestionnaire = async () => {
  if (CompanyData.hasCompanyData()) {
    await router.push({
      name: RouteName.CatalogProjects
    })
  } else {
    Navigation.toggleRegisterModal()
  }
}
</script>
