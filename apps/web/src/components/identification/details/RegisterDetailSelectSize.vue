<template>
  <DsfrSelect
    v-model="selection"
    :description="selectOptions.description"
    :options="selectOptions.options"
    :required="true"
    :error-message="selectOptions.errorMessage"
  />
</template>
<script lang="ts" setup>
import type { DsfrSelectProps } from '@gouvminint/vue-dsfr/types'

const selection = ref()
interface Props {
  selectOptions: DsfrSelectProps
}
defineProps<Props>()
</script>
