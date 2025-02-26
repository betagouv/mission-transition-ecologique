<template>
  <div id="register-size-field">
    <p
      v-if="infos.value"
      class="fr-tag fr-bg--blue--lightness"
    >
      <span class="fr-pr-4v">{{ sizeText }}</span>
      <span
        class="fr-icon-close-line fr-radius-a--2v fr-btn-bg"
        @click="resetSize"
      />
    </p>
    <DsfrSelect
      v-else
      v-model="selectedSize"
      :default-unselected-text="defaultUnselectedText"
      :options="sizeOptions"
    />
    <div
      v-if="hasError"
      :class="errorMessage ? 'fr-error-text' : ''"
      class="fr-input--empty-text fr-mt-2v"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetailSize, SizeToText, StructureSize } from '@/types'
import Breakpoint from '@/tools/breakpoints'

interface Props {
  infos: RegisterDetailSize
  manual: boolean
  showError: boolean
}
const props = defineProps<Props>()
const selectedSize = defineModel<StructureSize>()
const defaultUnselectedText = computed(() => {
  if (Breakpoint.isSmallScreen()) {
    return 'Combien êtes vous ?'
  }
  return props.infos.description
})
const hasError = computed<boolean>(() => {
  return !props.infos.value && props.showError
})
const errorMessage = computed<string>(() => {
  if (hasError && props.showError) {
    return "La sélection de l'effectif est nécessaire"
  }
  return ''
})
const sizeText = computed(() => {
  return SizeToText[props.infos.value as StructureSize]?.label
})

const sizeOptions = Object.keys(SizeToText).map((key) => {
  return {
    value: key,
    text: SizeToText[key as StructureSize].label
  }
})

const resetSize = () => {
  selectedSize.value = undefined
}
</script>
<style lang="scss" scoped>
#register-size-field {
  height: 40px;
}
</style>
