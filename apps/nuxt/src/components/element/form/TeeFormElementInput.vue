<template>
  <DsfrInputGroup
    :error-message="getErrorMessage()"
    :valid-message="getValidMessage()"
  >
    <DsfrInput
      v-model="model"
      class="fr-bg--white"
      :type="field.type"
      label-visible
      :is-valid="field.isValid"
      :required="field.required"
      :label="field.label"
      :rows="field.rows"
      :is-textarea="!!field.rows"
      :wrapper-class="field.wrapperClass"
      :hint="field.hint"
    >
      <template
        v-if="field.callOut"
        #label
      >
        {{ field.label }}
        <slot name="required-tip">
          <span
            v-if="field.required"
            class="required"
            >*</span
          >
        </slot>

        <TeeCallout
          class="custom-callout fr-bg--purple fr-text--white fr-px-2v fr-pt-2v fr-pb-0 fr-mb-0 fr-text--bold"
          :type="field.callOut.type"
          :img="field.callOut.img"
          :img-container-class="'fr-col-xl-2 fr-hidden fr-unhidden-lg'"
          :content-class="'fr-pb-2v fr-px-3v fr-px-lg-0'"
        >
          {{ field.callOut.content }}
        </TeeCallout>
      </template>
    </DsfrInput>
  </DsfrInputGroup>
</template>
<script lang="ts" setup>
import { StringFieldUnionType } from '@/types'

interface Props {
  field: StringFieldUnionType
  getErrorMessage: () => string
  getValidMessage: () => string
}
defineProps<Props>()
const model = defineModel<StringFieldUnionType['value']>()
</script>
