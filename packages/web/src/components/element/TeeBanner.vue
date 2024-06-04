<template>
  <div class="fr-grid-row">
    <div class="fr-grid-row fr-grid-row--center">
      <div :class="titleContainerClass">
        <h1 :class="titleClass">{{ title }}</h1>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--center">
      <div
        v-if="description"
        :class="descriptionContainerClass"
      >
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
  titleClass: string
  titleContainerClass: string
  descriptionClass: string
  descriptionContainerClass: string
  description?: string | undefined
}

withDefaults(defineProps<TeeBannerProps>(), {
  title: '',
  titleClass: 'fr-text--blue-france',
  titleContainerClass: 'fr-col-lg-7 fr-col-md-8 fr-px-4w',
  descriptionClass: 'fr-text--md',
  descriptionContainerClass: 'fr-col-xl-7 fr-col-md-10 fr-col-12 fr-col-sm-11 fr-px-1v',
  description: undefined
})
</script>
