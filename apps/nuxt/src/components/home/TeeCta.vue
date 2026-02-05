<template>
  <div class="fr-container fr-py-7v fr-px-6v tee-cta-image">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col fr-col-md-8 fr-col-lg-8">
        <div class="fr-grid-row">
          <div class="fr-col-12">
            <div class="fr-grid-row">
              <div class="fr-col-12">
                <p
                  v-if="overline"
                  class="fr-text--purple fr-h4 fr-text--bold fr-mb-2v fr-text--blue-agir"
                >
                  {{ overline }}
                </p>
                <h1 class="fr-mb-6v fr-text--blue-900">
                  Découvrez vos aides éligibles
                  <span class="fr-display-lg--block">parmi <span class="fr-text--green-agir">tous les financeurs publics</span></span>
                </h1>
              </div>
              <div class="fr-col-12 fr-col-lg-10">
                <h2 class="fr-text--lg fr-text--regular fr-text--blue-900">
                  Identifiez facilement les aides publiques adaptées à votre entreprise
                  <span class="fr-display-xl--block"> pour concrétiser vos projets de transition écologique.</span>
                </h2>
              </div>
            </div>
          </div>
          <div class="fr-col-lg-8 fr-col-md-10 fr-col-sm-12 fr-col-xs-12 tee-home-cta-btn">
            <TeeDsfrButton
              size="lg"
              class="fr-text--bold fr-text-xl fr-btn-fullwidth fr-btn-align-center fr-btn-bg fr-btn-bg--blue-agir"
              :only-label="buttonLabel"
              @click="$emit('onClickButton')"
            >
              <span v-html="buttonLabel"></span>
            </TeeDsfrButton>
          </div>
        </div>
      </div>
      <div class="fr-col-2 fr-col-md-4 fr-col--middle fr-col-lg-4 fr-col-unhidden-md fr-col-hidden"></div>
    </div>
    <TeeIllustration
      class="illustration"
      :height="svgHeight ?? '300'"
    />
  </div>
</template>
<script setup lang="ts">
interface Props {
  overline?: string
  svgHeight?: number | string
  buttonLabel?: string
}

withDefaults(defineProps<Props>(), {
  buttonLabel: 'Je trouve les aides <span class="fr-display--block fr-display-sm--inline">pour mon projet</span>'
})

defineEmits<{
  onClickButton: []
}>()
</script>

<style scoped lang="scss">
.tee-cta-image {
  position: relative;

  .illustration :deep(svg) {
    position: absolute;
    bottom: 0;
    right: 0;
    width: auto;
  }
}
</style>
