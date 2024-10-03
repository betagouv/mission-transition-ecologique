<template>
  <div class="fr-consent-service__radios">
    <DsfrRadioButtonSet
      v-model="localStatus"
      :name="name"
      :options="options"
      inline
      @update:model-value="emit('update:modelValue', localStatus)"
    />
  </div>
</template>
<script setup lang="ts">
import { DsfrRadioButtonSetProps } from '@gouvminint/vue-dsfr/types'

interface Props {
  options: DsfrRadioButtonSetProps['options']
  status: boolean
  name: string
}

const props = defineProps<Props>()

const localStatus = ref(props.status)
const emit = defineEmits<{
  (e: 'update:modelValue', payload: boolean): void
}>()

watch(
  () => props.status,
  (newValue) => {
    localStatus.value = newValue
  }
)
</script>
