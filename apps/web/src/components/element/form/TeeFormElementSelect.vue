<template>
  <DsfrInputGroup
    :error-message="getErrorMessage()"
    :valid-message="getValidMessage()"
  >
    <DsfrSelect
      v-model="localField.value"
      :label="localField.label"
      :required="localField.required"
      :name="`form-select-${localField.label}`"
      :options="localField.options"
      @update:model-value="validateFormField"
    />
  </DsfrInputGroup>
</template>
<script lang="ts" setup>
import { DefaultFieldFormType } from '@/types'

interface Props {
  field: DefaultFieldFormType
  publicPath: string
  getErrorMessage: () => ''
  getValidMessage: () => ''
}

const props = defineProps<Props>()
const localField = ref<DefaultFieldFormType>(props.field)

const emit = defineEmits<{ (e: 'updateField', payload: DefaultFieldFormType['value']): void }>()

const validateFormField = (): void => {
  emit('updateField', localField.value.value)
}
</script>
