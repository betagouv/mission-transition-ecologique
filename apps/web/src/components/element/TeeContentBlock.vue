<template>
  <DsfrAccordion
    v-if="isAccordion"
    :title="title"
    :expanded-id="expandedId"
    @expand="(id: string | undefined) => (expandedId = id)"
  >
    <template #title>
      <slot name="title" />
    </template>
    <slot name="content" />
  </DsfrAccordion>

  <div
    v-else
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
  isAccordion?: boolean //NOTE: if accordion is true, this component must be nested in a DsfrAccordionsGroup component to work properly
}

const props = withDefaults(defineProps<Props>(), {
  isAccordion: false,
  content: undefined,
  borderPosition: undefined
})

const expandedId = ref<string | undefined>('details')

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
