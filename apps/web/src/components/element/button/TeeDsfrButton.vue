<template>
  <DsfrButton
    v-bind="props"
    :icon="iconComputed"
  >
    <slot name="default"></slot>
  </DsfrButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr/types/components/DsfrButton/DsfrButton.vue'

interface DsfrButtonPropsWithLoading extends DsfrButtonProps {
  loading?: boolean
}
const props = defineProps<DsfrButtonPropsWithLoading>()

const iconComputed = computed<string | Record<string, string> | undefined>(() => {
  if (props.loading) {
    return { name: 'fr-icon-refresh-line', animation: 'spin' }
  }

  return props?.icon as string | Record<string, string> | undefined
})
</script>
