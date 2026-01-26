<template>
  <div
    class="fr-container--fluid fr-banner"
    :class="bgClass"
  >
    <div class="fr-bg-banner">
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
}

const props = withDefaults(defineProps<TeeBannerProps>(), {
  bgColor: undefined
})

const bgClass = computed(() => {
  return {
    [`fr-bg--${props.bgColor}`]: props.bgColor
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
