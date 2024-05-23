<template>
  <div
    class="fr-grid-row fr-py-1-5v"
    :class="rowClass"
  >
    <template
      v-for="({ icon, text }, index) in infos"
      :key="index"
    >
      <div
        class="fr-px-2v fr-col-content--middle fr-col-justify--center"
        :class="'fr-col-' + colLength()"
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
</script>
