<template>
  <div
    class="container-fluid tee-banner"
    :class="bgClass"
  >
    <img
      v-if="props.bgImage"
      :src="props.bgImage"
      :alt="props.imgAlt"
    />
    <div :class="styleClass">
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

const bgClass = computed(() => {
  if (props.bgColor) {
    if (props.hasGradient) {
      return `fr-gradient--${props.bgColor}`
    }
    return `fr-bg--${props.bgColor}`
  }

  return ''
})

const styleClass = computed(() => {
  const style = [bgClass.value]
  console.log(props.hasGradient)
  if (props.hasGradient) {
    style.push('tee-banner__gradient')
  }

  if (props.contentAlignment) {
    style.push(`fr-col-content--${props.contentAlignment.v}`, `fr-col-justify--${props.contentAlignment.h}`)
  }

  return style.join(' ')
})
</script>
