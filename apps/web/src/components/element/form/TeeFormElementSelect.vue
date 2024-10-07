<template>
  <DsfrInputGroup
    :error-message="getErrorMessage()"
    :valid-message="getValidMessage()"
  >
    <DsfrSelect
      v-model="model"
      :label="field.label"
      :required="field.required"
      :name="`form-select-${field.label}`"
      :options="field.options"
    />
  </DsfrInputGroup>
</template>
<script lang="ts" setup>
import { SelectFieldInputType } from '@/types'

interface Props {
  field: SelectFieldInputType
  publicPath: string
  getErrorMessage: () => ''
  getValidMessage: () => ''
}

defineProps<Props>()
const model = defineModel<SelectFieldInputType['value']>()
</script>
