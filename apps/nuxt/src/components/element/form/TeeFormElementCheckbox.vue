<template>
  <DsfrCheckbox
    v-model="model"
    :name="`form-checkbox-${field.label}`"
    :value="`form-checkbox-${field.label}`"
    :valid-message="getValidMessage()"
    :error-message="getErrorMessage()"
  >
    <template #label>
      <span :teste2e-selector="`${fieldKey}-${field.type}`">
        {{ field.label }}
        <router-link
          v-if="field.hintLink"
          :to="{ name: field.hintLink.route }"
          target="_blank"
        >
          {{ field.hintLink.text }}
        </router-link>
        .
        <code>*</code>
      </span>
    </template>
  </DsfrCheckbox>
</template>
<script lang="ts" setup>
import { BooleanFieldInputType } from '@/types'

interface Props {
  field: BooleanFieldInputType
  fieldKey: string
  getErrorMessage: () => string
  getValidMessage: () => string
}

defineProps<Props>()
const model = defineModel<BooleanFieldInputType['value']>()
</script>
