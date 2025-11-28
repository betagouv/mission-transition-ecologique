<template>
  <DsfrButton
    v-bind="props"
    :icon="iconComputed"
    :aria-label="onlyLabel"
  >
    <slot name="default"></slot>
  </DsfrButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr/types/components/DsfrButton/DsfrButton.vue'

interface DsfrButtonPropsWithLoading extends DsfrButtonProps {
  loading?: boolean
  onlyLabel?: string
}
const props = defineProps<DsfrButtonPropsWithLoading>()

const iconComputed = computed<string | Record<string, string> | undefined>(() => {
  return props?.icon as string | Record<string, string> | undefined
})
</script>
