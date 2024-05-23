<template>
  <div class="fr-grid-row fr-text-line-height--9v">
    <template
      v-for="({ icon, text }, index) in infos"
      :key="index"
    >
      <div
        class="fr-px-2v fr-col-content--middle fr-col-justify--center"
        :class="colClasses(index)"
      >
        <span
          v-if="icon"
          :class="icon + ' fr-icon--sm fr-mr-1-5v'"
          aria-hidden="true"
        />
        {{ text }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Color } from '@/types'

interface Props {
  infos: { icon: string; text: string }[]
  radiusSize?: '2v' | '4v'
  bgColor?: Color
}

const props = defineProps<Props>()

const colLength = () => {
  return Math.floor(12 / props.infos.length)
}

const colClasses = (index: number) => {
  const col = ['fr-col-' + colLength()]
  if (props.radiusSize) {
    if (index === 0) {
      col.push(' fr-radius-l--' + props.radiusSize)
    }

    if (index === props.infos.length - 1) {
      col.push(' fr-radius-r--' + props.radiusSize)
    }
  }

  if (props.bgColor) {
    col.push('fr-bg--' + props.bgColor)
  }

  return col.join(' ')
}
</script>
