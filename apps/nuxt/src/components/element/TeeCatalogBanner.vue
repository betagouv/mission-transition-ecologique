<template>
  <div
    class="fr-container--fluid fr-banner"
    :class="bgClass"
  >
    <div
      :class="[styleClass]"
      class="fr-bg-banner"
    >
      <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--middle">
          <slot name="title" />
          <slot name="description" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Color } from '@/types'

export interface TeeBannerProps {
  bgColor?: Color
  hasGradient?: boolean
  contentAlignment?:
    | {
        v?: 'top' | 'bottom' | 'middle' | undefined
        h?: 'left' | 'right' | 'center' | undefined
      }
    | undefined
}

const props = withDefaults(defineProps<TeeBannerProps>(), {
  bgColor: undefined,
  contentAlignment: undefined
})

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

<style scoped lang="scss">
.fr-banner .fr-bg-banner {
  background-image: url('/images/cercle-catalogue.svg');
  background-repeat: no-repeat;
  background-size: 473px 239px;
  background-position: bottom right;
}
</style>
