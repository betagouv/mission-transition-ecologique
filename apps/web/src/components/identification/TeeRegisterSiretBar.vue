<template>
  <DsfrInputGroup
    :error-message="errorMessage"
    class="fr-mb-0"
  >
    <span class="fr-hint-text fr-text--white fr-col-justify--left fr-mb-2v">
      ex : "Fromagerie Sanzot Angers" ou N° SIRET "130 025 265 00013"
    </span>
    <div
      id="header-search"
      class="fr-search-bar"
      role="search"
    >
      <DsfrInput
        v-model="model"
        name="register-siret-input"
        :disabled="isLoading"
        type="search"
        class="fr-mb-0"
        @keyup.enter="onClick"
      />
      <DsfrButton
        id="siret-search"
        class="fr-bg--yellow"
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

interface Props {
  isLoading?: boolean
  errorMessage?: string
}
withDefaults(defineProps<Props>(), {
  isLoading: false,
  errorMessage: undefined
})

const model = defineModel<string | undefined>()

const emit = defineEmits<{
  onClick: []
  onClear: []
}>()

const onClick = () => {
  emit('onClick')
}
</script>
<style lang="scss" scoped>
@use '@/assets/scss/setting';

#siret-search {
  box-shadow: inset 0 -2px 0 0 setting.$blue-france;
}
</style>
