<template>
  <DsfrInputGroup :error-message="errorMessage">
    <label
      v-if="option.label"
      class="fr-label fr-mb-2v"
      :for="`input-${option.id}`"
    >
      {{ option.label[Translation.lang] }}
    </label>
    <span
      v-if="option.hintLabel"
      class="fr-hint-text fr-mb-2v"
    >
      {{ option?.hintLabel?.[Translation.lang] }}
    </span>
    <div
      v-if="option?.placeholder"
      class="fr-mb-1v fr-bg--grey tee-font-style--italic"
    >
      {{ option?.placeholder?.[Translation.lang] }}
    </div>
    <div
      id="header-search"
      :class="isLoading ? 'fr-search-bar--loading' : ''"
      class="fr-search-bar fr-search-bar--blue-france fr-search-bar-lg"
      role="search"
    >
      <DsfrInput
        :id="`input-${option.id}`"
        v-model="model"
        :name="`input-${option.id}`"
        :disabled="isLoading"
        :hint="option?.placeholder?.[Translation.lang]"
        type="search"
        @keyup.enter="onClick"
      />
      <DsfrButton
        v-if="model"
        class="search-clear"
        icon="fr-icon-close-line"
        icon-only
        no-outline
        tertiary
        :disabled="isLoading"
        @click="onClear"
      />
      <DsfrButton
        class="search-button"
        :disabled="isLoading"
        :title="Translation.t('input.search')"
        @click="onClick"
      />
    </div>
    <div
      v-if="hasHint && option.hint"
      class="tee-input-hint fr-mt-4v"
    >
      <span v-html="option.hint[Translation.lang]" />
    </div>
  </DsfrInputGroup>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeDsfrSearchBar > FUNCTION_NAME > MSG_OR_VALUE :`)

import { type TrackOptionsInput } from '@/types'
import Translation from '@/tools/translation'
import { DsfrInputGroup, DsfrInput, DsfrButton } from '@gouvminint/vue-dsfr'

interface Props {
  option: TrackOptionsInput
  isLoading?: boolean
  errorMessage?: string
  hasHint?: boolean
}
withDefaults(defineProps<Props>(), {
  isLoading: false,
  errorMessage: undefined,
  hasHint: false
})

const model = defineModel<string | undefined>()

const emit = defineEmits<{
  onClick: []
  onClear: []
}>()

const onClick = () => {
  emit('onClick')
}

// functions
const onClear = () => {
  model.value = undefined
  emit('onClear')
}
</script>
