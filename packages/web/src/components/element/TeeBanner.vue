<template>
  <div
    class="fr-container--fluid"
    :class="bgClass"
  >
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--middle fr-grid-row--center">
        <div :class="titleContainerClass">
          <h1 :class="titleClass">{{ title }}</h1>
        </div>
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
  </div>
</template>

<script setup lang="ts">
import { Color } from '@/types'

export interface TeeBannerProps {
  title: string
  titleClass?: string
  titleContainerClass?: string
  description?: string | undefined
  descriptionClass?: string
  descriptionContainerClass?: string
  bgColor?: Color
}

const props = withDefaults(defineProps<TeeBannerProps>(), {
  title: '',
  titleClass: 'fr-text--blue-france',
  titleContainerClass: 'fr-col-10',
  descriptionClass: 'fr-text--md',
  descriptionContainerClass: 'fr-col-12 fr-px-1v',
  description: undefined,
  bgColor: undefined
})

const bgClass = computed(() => {
  if (props.bgColor) {
    return [`fr-bg--${props.bgColor}`]
  }

  return []
})
</script>
