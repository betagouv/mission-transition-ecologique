<template>
  <DsfrInputGroup :error-message="errorMessage">
    <span class="fr-hint-text fr-text--white fr-col-justify--left fr-mb-2v">
      ex : "Fromagerie Sanzot Angers" ou N° SIRET "130 025 265 00013"
    </span>
    <div
      id="header-search"
      class="fr-search-bar fr-search-bar-lg fr-search-bar--yellow"
      :class="isLoading ? 'fr-search-bar--loading' : ''"
      role="search"
    >
      <DsfrInput
        ref="siretSearchBar"
        v-model="model"
        name="register-siret-input"
        :disabled="isLoading"
        type="search"
        @keyup.enter="onClick"
      />
      <TeeDsfrButton
        class="fr-bg--yellow search-button"
        tertiary
        no-outline
        :disabled="isLoading"
        :title="Translation.t('input.search')"
        @click="onClick"
      />
    </div>
  </DsfrInputGroup>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeDsfrSearchBar > FUNCTION_NAME > MSG_OR_VALUE :`)

import Translation from '@/utils/translation'
import { onClickOutside } from '@vueuse/core'

interface Props {
  isLoading?: boolean
  errorMessage?: string
}
withDefaults(defineProps<Props>(), {
  isLoading: false,
  errorMessage: undefined
})
const model = defineModel<string | undefined>()
const siretSearchBar = ref(null)
const emit = defineEmits<{
  onClick: []
  onClear: []
}>()

const onClick = () => {
  emit('onClick')
}
onClickOutside(siretSearchBar, () => emit('onClear'))
</script>
