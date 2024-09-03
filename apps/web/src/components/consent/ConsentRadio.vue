<template>
  <div class="fr-consent-service__radios">
    <DsfrRadioButtonSet
      v-model="status"
      :name="name"
      :options="options"
      inline
      @update:model-value="emit('update:modelValue', status)"
    />
  </div>
</template>
<script setup lang="ts">
import { DsfrRadioButtonSetProps } from '@gouvminint/vue-dsfr/types'

interface Props {
  options: DsfrRadioButtonSetProps['options']
  initial: boolean
  name: string
}

const emit = defineEmits<{
  (e: 'update:modelValue', payload: boolean): void
}>()

const props = defineProps<Props>()

const status = ref<boolean>(props.initial)
</script>
