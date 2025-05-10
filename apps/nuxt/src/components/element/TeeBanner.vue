<template>
  <div
    class="fr-container--fluid fr-banner"
    :class="bgClass"
  >
    <img
      v-if="props.bgImage"
      :src="img(props.bgImage, { quality: 70, densities: 1, sizes: '576px sm:768px md:992px lg:1248px' })"
      :alt="props.imgAlt"
    />
    <div :class="[styleClass]">
      <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--center fr-grid-row--middle">
          <slot name="title" />
          <slot name="description" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Image } from '@/tools/image'
import { Color } from '@/types'

export interface TeeBannerProps {
  bgColor?: Color
  hasGradient?: boolean
  bgImage?: string
  imgAlt?: string
  contentAlignment?:
    | {
        v?: 'top' | 'bottom' | 'middle' | undefined
        h?: 'left' | 'right' | 'center' | undefined
      }
    | undefined
}

const props = withDefaults(defineProps<TeeBannerProps>(), {
  bgColor: undefined,
  bgImage: undefined,
  imgAlt: '',
  contentAlignment: undefined
})

const img = Image.getUrl

const bgClass = computed(() => {
  return {
    [`fr-gradient--${props.bgColor}`]: props.hasGradient && props.bgColor,
    [`fr-bg--${props.bgColor}`]: !props.hasGradient && props.bgColor
  }
})

const styleClass = computed(() => {
  return {
    ...bgClass.value,
    'fr-banner__h100w100': props.hasGradient,
    [`fr-col-content--${props.contentAlignment?.v}`]: props.contentAlignment?.v,
    [`fr-col-justify--${props.contentAlignment?.h}`]: props.contentAlignment?.h
  }
})
</script>
