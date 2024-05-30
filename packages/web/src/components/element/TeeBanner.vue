<template>
  <div class="fr-grid-row fr-grid-row--center fr-grid-row--middle fr-text-center fr-py-6w">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-lg-7 fr-col-md-8 fr-px-4w">
        <h1 :class="titleClass">{{ title }}</h1>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-xl-7 fr-col-10 fr-px-4w">
        <p :class="descriptionClass">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TeeBannerProps {
  title: string
  titleClass?: string
  description?: string
  descriptionClass?: string
}

withDefaults(defineProps<TeeBannerProps>(), {
  title: '',
  titleClass: 'fr-text--blue-france',
  description: '',
  descriptionClass: 'fr-text--md'
})
</script>
