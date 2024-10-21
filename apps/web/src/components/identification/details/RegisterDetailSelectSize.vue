<template id="select-company-size">
  <span class="fr-hint-text fr-text--white tee-font-style--italic">
    {{ selectOptions.description }}
  </span>
  <div id="select-company-size">
    <DsfrSelect
      v-model="selection"
      :error-message="selection ? '' : selectOptions.errorMessage"
      :options="selectOptions.options"
    />
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetailType } from '@/types'
import type { DsfrSelectProps } from '@gouvminint/vue-dsfr/types'

const selection = ref()
interface Props {
  selectOptions: DsfrSelectProps
  editable: boolean
  type: RegisterDetailType
  label: string | undefined
}
defineProps<Props>()
</script>
<style lang="scss" scoped>
#select-company-size {
  width: 30%;
}
</style>
