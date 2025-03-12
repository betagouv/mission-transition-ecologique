<template>
  <div class="fr-container fr-py-7v fr-px-6v">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col fr-col-md-8 fr-col-lg-8">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-mb-4v">
            <div class="fr-grid-row">
              <div class="fr-col-12">
                <p class="fr-text--purple fr-h4 fr-text--bold fr-mb-6v">TPE, PME</p>
                <h1 class="fr-mb-3v">
                  Trouvez les solutions pour
                  <span class="fr-display-sm--block">la transition écologique </span>
                  <span class="fr-display-sm--block">de votre entreprise</span>
                </h1>
              </div>
              <div class="fr-col-12 fr-col-lg-9">
                <h2 class="fr-text--lg">
                  Identifiez facilement les aides publiques adaptées
                  <span class="fr-display-lg--block">à votre entreprise pour concrétiser vos projets</span>
                  <span class="fr-display-lg--block"> de transition écologique.</span>
                </h2>
              </div>
            </div>
          </div>
          <div class="fr-col-xl-8 fr-col-lg-10 fr-col-md-10 fr-col-sm-12 fr-col-xs-12 tee-home-cta-btn">
            <TeeDsfrButton
              size="lg"
              class="inline-flex fr-text--yellow fr-text--bold fr-text-xl fr-btn-fullwidth fr-btn-align-center"
              @click="toQuestionnaire()"
            >
              <template #default>
                Je trouve les aides <span class="fr-display--block fr-display-lg--inline">pour mon projet</span>
              </template>
            </TeeDsfrButton>
          </div>
        </div>
      </div>
      <div class="fr-col-2 fr-col-md-4 fr-col--middle fr-col-lg-4 tee-track-image-right fr-sm-hide">
        <img
          class="fr-responsive-img"
          src="/images/TEE-illustrationHP.png"
          alt="image / callout"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouteName } from '@/types/routeType'
import { type RouteLocationAsRelativeGeneric } from 'vue-router'

const router = useRouter()

const routeToBaseList: RouteLocationAsRelativeGeneric = {
  name: RouteName.QuestionnaireStart
}
const toQuestionnaire = async () => {
  await router.push(routeToBaseList)
}
</script>
<style scoped lang="scss">
.tee-track-image-right > .fr-responsive-img {
  max-height: 400px;
  width: auto;
}
</style>
