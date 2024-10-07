<template>
  <div :class="`fr-col-${localField.colSize || '12'} fr-col-md-${localField.colSize || '12'}`">
    <component
      :is="currentComponent"
      :field="localField"
      :public-path="publicPath"
      :get-error-message="getErrorMessage"
      :get-valid-message="getValidMessage"
      @update-field="(value) => validateFormField(value as DefaultFieldFormType['value'])"
    />
  </div>
</template>
<script setup lang="ts">
import { FieldType, DefaultFieldFormType, isValidatedStringFieldInputType } from '@/types'
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
  field: DefaultFieldFormType
}
const props = defineProps<Props>()

const emit = defineEmits<{
  updateField: [payload: DefaultFieldFormType]
}>()
const localField = ref<DefaultFieldFormType>(props.field)
const isFieldValid = (): boolean => {
  return localField.value.value !== undefined && localField.value.value !== '' && localField.value.value !== false
}

const validateFormField = (value: DefaultFieldFormType['value']): void => {
  localField.value.value = value
  if (isValidatedStringFieldInputType(localField.value)) {
    localField.value.isValid = localField.value.validation(localField.value.value, !!localField.value.label?.includes('SIRET')) as boolean
  } else {
    localField.value.isValid = isFieldValid()
  }
  emit('updateField', localField.value)
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
