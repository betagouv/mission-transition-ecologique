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

const props = withDefaults(defineProps<Props>(), {
  content: undefined,
  borderPosition: undefined
})

const getBorderStyleClass = () => {
  if (!props.borderPosition) {
    return ''
  }

  if (props.borderPosition.includes(BorderPosition.all)) {
    return 'tee-border'
  }

  return props.borderPosition.map((position) => `tee-border--${position}`).join(' ')
}
</script>
<style lang="scss" scoped>
// TODO : remove once border global refacto is implemented
.tee-border {
  &--top {
    border-top: solid 1px var(--border-default-grey);
  }

  &--bottom {
    border-bottom: solid 1px var(--border-default-grey);
  }

  &--right {
    border-right: solid 1px var(--border-default-grey);
  }

  &--left {
    border-left: solid 1px var(--border-default-grey);
  }

  border: solid 1px var(--border-default-grey);
}
</style>
