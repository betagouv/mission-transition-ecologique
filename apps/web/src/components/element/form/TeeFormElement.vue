<template>
  <div
    v-if="localField.type === FieldType.Checkbox"
    :class="`fr-col-${localField.colSize || '12'} fr-col-md-${localField.colSize || '12'}`"
  >
    <DsfrCheckbox
      v-model="localField.value"
      :name="`form-checkbox-${localField.label}`"
      :is-valid="localField.isValid"
      :required="localField.required"
      @update:model-value="validateFormField"
      @focusout="validateFormField"
    >
      <template #label>
        <span> {{ localField.label }} <code>*</code></span>
      </template>
    </DsfrCheckbox>
    <!-- CHECKBOX HINT -->
    <span class="fr-hint-text fr-mt-5v">
      {{ localField.hint }}
      <router-link
        v-if="localField.hintLink"
        :to="{ name: localField.hintLink.route }"
        target="_blank"
      >
        {{ localField.hintLink.text }}
      </router-link>
      .
    </span>
  </div>
  <div
    v-else-if="localField.type === FieldType.Select"
    :class="`fr-col-${localField.colSize || '12'} fr-col-md-${localField.colSize || '12'}`"
  >
    <DsfrInputGroup
      :error-message="getErrorMessage()"
      :valid-message="getValidMessage()"
    >
      <DsfrSelect
        v-model="localField.value.value"
        :label="localField.label"
        :required="localField.required"
        :name="`form-select-${localField.label}`"
        :options="localField.options"
      />
    </DsfrInputGroup>
  </div>
  <div
    v-else
    :class="`fr-col-${localField.colSize || '12'} fr-col-md-${localField.colSize || '12'}`"
  >
    <DsfrInputGroup
      :error-message="getErrorMessage()"
      :valid-message="getValidMessage()"
    >
      <DsfrInput
        v-model="localField.value"
        class="fr-bg--white"
        :type="localField.type"
        label-visible
        :is-valid="localField.isValid"
        :required="localField.required"
        :label="localField.label"
        :rows="localField.rows"
        :is-textarea="!!localField.rows"
        :wrapper-class="localField.wrapperClass"
        :hint="field.hint"
        @focusout="validateFormField"
      >
        <template
          v-if="localField.callOut"
          #label
        >
          {{ localField.label }}
          <slot name="required-tip">
            <span
              v-if="localField.required"
              class="required"
              >*</span
            >
          </slot>

          <TeeCallout
            class="fr-bg--blue fr-text--white fr-px-2v fr-pt-2v fr-pb-0 fr-mb-0 fr-text--bold"
            :type="localField.callOut.type"
            :img="`${publicPath}${localField.callOut.img}`"
            :img-container-class="'fr-col-xl-2 fr-hidden fr-unhidden-lg'"
            :content-class="'fr-pb-2v fr-px-3v fr-px-lg-0'"
          >
            {{ localField.callOut.content }}
          </TeeCallout>
        </template>
      </DsfrInput>
    </DsfrInputGroup>
  </div>
</template>
<script setup lang="ts">
import { FieldType, DefaultFieldFormType } from '@/types'
import Config from '@/config'

const publicPath = Config.publicPath !== 'undefined/' ? Config.publicPath : '../../public/'

interface Props {
  field: DefaultFieldFormType
}
const props = defineProps<Props>()

const emit = defineEmits<{ (e: 'updateField', payload: DefaultFieldFormType): void }>()

const localField = ref<DefaultFieldFormType>(props.field)
const isFieldValid = (): boolean => {
  return localField.value.value !== undefined && localField.value.value !== '' && localField.value.value !== false
}

const validateFormField = (): void => {
  if (localField.value.validation) {
    localField.value.isValid = localField.value.validation(localField.value.value, !!localField.value.label?.includes('SIRET')) as boolean
  } else {
    localField.value.isValid = isFieldValid()
  }
  emit('updateField', localField.value)
}

const getErrorMessage = (): string => {
  if (!localField.value.validation || !isFieldValid()) {
    return localField.value.isValid === false ? 'Ce champ est obligatoire.' : ''
  }
  return localField.value.isValid === false && localField.value.errorMessage ? localField.value.errorMessage : ''
}

const getValidMessage = (): string => {
  return localField.value.isValid === true ? ' ' : ''
}
</script>
