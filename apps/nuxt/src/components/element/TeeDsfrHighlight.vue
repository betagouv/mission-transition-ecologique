<template>
  <DsfrHighlight
    :class="`fr-highlight-border--${color} fr-highlight-bg--${color}--lightness`"
    class="fr-m-0 fr-p-0"
    :large="true"
  >
    <template #default>
      <div class="fr-container--fluid fr-p-4v">
        <div class="fr-grid-row fr-grid-row--middle">
          <img
            class="fr-col-2 fr-hidden fr-unhidden-sm"
            loading="lazy"
            :src="img"
            :alt="altImg"
          />
          <div class="fr-col-12 fr-col-sm-10 fr-px-8v">
            <p class="fr-mb-4v">{{ text }}</p>
            <slot />
          </div>
        </div>
      </div>
    </template>
  </DsfrHighlight>
</template>
<script setup lang="ts">
import { Color } from '@/types'

interface Props {
  large: boolean
  img: string
  text: string
  color: Color
  altImg: string
}
defineProps<Props>()
</script>
