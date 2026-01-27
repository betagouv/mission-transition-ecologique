<template>
  <DsfrTag
    v-bind="props"
    :class="classes"
  />
</template>

<script lang="ts" setup>
import { DsfrTag, DsfrTagProps } from '@gouvminint/vue-dsfr'

export interface TeeDsfrTagProps extends DsfrTagProps {
  color?: string
  value?: string | number
}

const props = defineProps<TeeDsfrTagProps>()

const classes = computed(() => {
  return {
    [`fr-tag--${props.color}`]: props.color
  }
})
</script>
