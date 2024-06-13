<template>
  <div
    class="fr-container--fluid"
    :class="bgClass"
  >
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--middle fr-grid-row--center">
        <slot name="title"></slot>
        <slot name="description"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Color } from '@/types'

export interface TeeBannerProps {
  title: string
  description?: string | undefined
  bgColor?: Color
}

const props = withDefaults(defineProps<TeeBannerProps>(), {
  title: '',
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
