<template>
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
</template>
<script lang="ts" setup>
import { DefaultFieldFormType } from '@/types'

interface Props {
  field: DefaultFieldFormType
  publicPath: string
}

const props = defineProps<Props>()
const localField = ref<DefaultFieldFormType>(props.field)

const emit = defineEmits<{
  updateField: [payload: DefaultFieldFormType['value']]
}>()
const validateFormField = (): void => {
  emit('updateField', localField.value.value)
}
</script>
