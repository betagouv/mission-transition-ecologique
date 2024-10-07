<template>
  <div :class="`fr-col-${localField.colSize || '12'} fr-col-md-${localField.colSize || '12'}`">
    <component
      :is="currentComponent"
      v-model="fieldValueModel"
      :field="localField"
      :public-path="publicPath"
      :get-error-message="getErrorMessage"
      :get-valid-message="getValidMessage"
      @update:model-value="validateFormField"
    />
  </div>
</template>
<script setup lang="ts">
import { DefaultFieldFormType, FieldType, InputFieldUnionType, isValidatedStringFieldInputType } from '@/types'
import Config from '@/config'
import TeeFormElementCheckbox from './TeeFormElementCheckbox.vue'
import TeeFormElementSelect from './TeeFormElementSelect.vue'
import TeeFormElementInput from './TeeFormElementInput.vue'

const publicPath = Config.publicPath !== 'undefined/' ? Config.publicPath : '../../public/'
const currentComponent = computed(() => {
  switch (localField.value.type) {
    case FieldType.Checkbox:
      return TeeFormElementCheckbox
    case FieldType.Select:
      return TeeFormElementSelect
    default:
      return TeeFormElementInput
  }
})

interface Props {
  field: InputFieldUnionType
}
const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [payload: InputFieldUnionType]
}>()
const fieldValueModel = ref<DefaultFieldFormType['value']>(props.field.value)

const localField = ref<DefaultFieldFormType>(props.field)

const isFieldValid = (): boolean => {
  return localField.value.value !== undefined && localField.value.value !== '' && localField.value.value !== false
}

const validateFormField = (fieldValue: InputFieldUnionType['value']): void => {
  localField.value.value = fieldValue
  if (isValidatedStringFieldInputType(localField.value)) {
    localField.value.isValid = localField.value.validation(localField.value.value, !!localField.value.label?.includes('SIRET')) as boolean
  } else {
    localField.value.isValid = isFieldValid()
  }
  emit('update:modelValue', localField.value)
}

const getErrorMessage = (): string => {
  if (!isValidatedStringFieldInputType(localField.value) || !isFieldValid()) {
    return localField.value.isValid === false ? 'Ce champ est obligatoire.' : ''
  }
  return localField.value.isValid === false ? localField.value.errorMessage : ''
}

const getValidMessage = (): string => {
  return localField.value.isValid === true ? ' ' : ''
}
</script>
