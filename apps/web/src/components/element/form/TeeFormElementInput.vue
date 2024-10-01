<template>
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
