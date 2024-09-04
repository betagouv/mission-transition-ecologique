<template>
  <fieldset
    :aria-labelledby="`${cookie.value}-legend ${cookie.value}-desc`"
    role="group"
    class="fr-fieldset fr-fieldset--inline"
  >
    <legend
      :id="`${cookie.value}-legend`"
      class="fr-consent-service__title"
    >
      {{ cookie.name }}
    </legend>
    <ConsentRadio
      :status="cookie.accepted"
      :options="options"
      :name="`${cookie.name}_radio_button`"
      @update:model-value="(status) => emit('update:modelValue', status)"
    />
    <p
      :id="`${cookie.value}-desc`"
      class="fr-consent-service__desc"
    >
      {{ cookie.description }}
    </p>
  </fieldset>
</template>
<script lang="ts" setup>
import { type CookieManager } from '@/types/cookies'
import { DsfrRadioButtonSetProps } from '@gouvminint/vue-dsfr/types'

interface Props {
  cookie: CookieManager
}
defineProps<Props>()
const options: DsfrRadioButtonSetProps['options'] = [
  { label: 'Accepter', value: true },
  { label: 'Refuser', value: false }
]

const emit = defineEmits<{
  (e: 'update:modelValue', payload: boolean): void
}>()
</script>
