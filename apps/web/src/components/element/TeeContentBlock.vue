<template>
  <div
    class="fr-container"
    :class="getBorderStyleClass()"
  >
    <slot name="title">
      <h3>{{ title }}</h3>
    </slot>
    <slot name="content">
      <div>{{ content }}</div>
    </slot>
  </div>
</template>
<script lang="ts" setup>
import { BorderPosition } from '@/types'

interface Props {
  title: string
  content?: string
  borderPosition?: BorderPosition[]
}

const props = defineProps<Props>()

const getBorderStyleClass = () => {
  if (!props.borderPosition) {
    return ''
  }

  if (props.borderPosition.includes(BorderPosition.all)) {
    return 'fr-border--grey--light'
  }

  return props.borderPosition.map((position) => `fr-border-${position}--grey--light`).join(' ')
}
</script>
