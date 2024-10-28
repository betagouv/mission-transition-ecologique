<template>
  <DsfrCheckbox
    v-model="model"
    :name="`form-checkbox-${field.label}`"
    :is-valid="field.isValid"
    :required="field.required"
  >
    <template #label>
      <span> {{ field.label }} <code>*</code></span>
    </template>
  </DsfrCheckbox>
  <!-- CHECKBOX HINT -->
  <span class="fr-hint-text fr-mt-5v">
    {{ field.hint }}
    <router-link
      v-if="field.hintLink"
      :to="{ name: field.hintLink.route }"
      target="_blank"
    >
      {{ field.hintLink.text }}
    </router-link>
    .
  </span>
</template>
<script lang="ts" setup>
import { BooleanFieldInputType } from '@/types'

interface Props {
  field: BooleanFieldInputType
  publicPath: string
  getErrorMessage: () => string
  getValidMessage: () => string
}

defineProps<Props>()
const model = defineModel<BooleanFieldInputType['value']>()
</script>
