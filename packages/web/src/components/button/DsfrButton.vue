<template>
  <DsfrButton v-bind="props" :icon="iconComputed"/>
</template>

<script setup lang='ts'>
import type { DsfrButton } from '@gouvminint/vue-dsfr/types'
import { computed, ref, watch } from 'vue'
import { DsfrButtonProps } from '@gouvminint/vue-dsfr/types/components/DsfrButton/DsfrButton.vue'

interface DsfrButtonPropsWithloading extends DsfrButtonProps {
  loading?: boolean
}
const props = defineProps<DsfrButtonPropsWithloading>()

const icon =ref<string | Record<string, string>>()


const iconComputed = computed<string | Record<string, string> | undefined>(() => {
  if (props.loading) {
    return { name: 'ri-loader-4-line', animation: 'spin' }
  }

  return props?.icon as string | Record<string, string> | undefined
})
</script>
