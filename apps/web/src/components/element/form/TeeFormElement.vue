<template>
  <div :class="`fr-col-${size} fr-col-md-${size}`">
    <DsfrInputGroup
      :error-message="getErrorMessage()"
      :valid-message="getValidMessage()"
    >
      <DsfrInput
        v-model="localField.value"
        :type="type"
        label-visible
        :is-valid="localField.isValid"
        :required="localField.required"
        :label="localField.label"
        :rows="rows"
        :is-textarea="isTextarea"
        :wrapper-class="wrapperClass"
        :hint="field.hint"
        @focusout="validateFormField"
      >
        <template #label>
          <slot name="label"></slot>
        </template>
      </DsfrInput>
    </DsfrInputGroup>
  </div>
</template>
<script setup lang="ts">
import { InputFieldUnionTypeWithoutBoolean, isValidatedStringFieldInputType } from '@/types'

interface Props {
  field: InputFieldUnionTypeWithoutBoolean
  type: string
  size?: number
  rows?: number
  wrapperClass?: string
  isTextarea?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  size: 12,
  rows: 0,
  wrapperClass: '',
  isTextarea: false
})

const emit = defineEmits<{ (e: 'updateField', payload: InputFieldUnionTypeWithoutBoolean): void }>()

const localField = ref<InputFieldUnionTypeWithoutBoolean>(props.field)

const isFieldValid = (): boolean => {
  return localField.value.value !== undefined && localField.value.value !== ''
}

const validateFormField = (): void => {
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
