<template>
  <DsfrSelect
    v-model="model"
    :teste2e-selector="`${fieldKey}-${field.type}`"
    :label="field.label"
    :error-message="getErrorMessage()"
    :valid-message="getValidMessage()"
    :required="field.required"
    :name="`form-select-${field.label}`"
    :options="field.options"
  />
</template>
<script lang="ts" setup>
import { SelectFieldInputType } from '@/types'

interface Props {
  field: SelectFieldInputType
  fieldKey: string
  getErrorMessage: () => string
  getValidMessage: () => string
}

defineProps<Props>()
const model = defineModel<SelectFieldInputType['value']>()
</script>
