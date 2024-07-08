<template>
  <div
    class="fr-grid-row fr-py-1-5v fr-text--sm"
    :class="rowClass"
  >
    <template
      v-for="({ icon, text }, index) in infos"
      :key="index"
    >
      <div
        class="fr-px-2v fr-col-content--middle"
        :class="colClass"
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
  radiusSize?: '0' | '1v' | '2v' | '2-5v'
  bgColor?: Color
  fullLine?: boolean
  justify?: 'center' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  radiusSize: undefined,
  bgColor: undefined,
  fullLine: false,
  justify: 'center'
})

const colLength = () => {
  if (props.fullLine) {
    return 12
  }

  return Math.floor(12 / props.infos.length)
}

const rowClass = computed(() => {
  const row = []
  if (props.bgColor) {
    row.push('fr-bg--' + props.bgColor)
  }
  if (props.radiusSize) {
    row.push('fr-radius-a--' + props.radiusSize)
  }

  return row.join(' ')
})

const colClass = computed(() => {
  const col = ['fr-col-' + colLength()]
  if (props.justify) {
    col.push('fr-col-justify--' + props.justify)
  }

  return col.join(' ')
})
</script>
