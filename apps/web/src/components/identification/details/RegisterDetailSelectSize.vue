<template>
  <span class="fr-hint-text fr-text--white tee-font-style--italic">
    {{ selectOptions.description }}
  </span>
  <DsfrSelect
    id="select-company-size"
    v-model="selection"
    :error-message="selection ? '' : selectOptions.errorMessage"
    :options="selectOptions.options"
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
<style lang="scss" scoped>
#select-company-size {
  width: 30%;
}
</style>
