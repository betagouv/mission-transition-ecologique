<template id="select-company-size">
  <p
    v-if="infos.value"
    class="fr-tag fr-mb-4v fr-bg--blue-france--lightness"
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
</template>
<script lang="ts" setup>
import { RegisterDetailSize, StructureSize } from '@/types'
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
  const sizeOption = sizeOptions.find((el: { value: StructureSize; text: string }) => el.value === props.infos.value)
  return sizeOption?.text
})
const sizeOptions = [
  {
    value: StructureSize.EI,
    text: '‍️🧍Je suis un micro-entrepreneur'
  },
  {
    value: StructureSize.MICRO,
    text: '‍️👫 Moins de 10 employés'
  },

  {
    value: StructureSize.TPE,
    text: '‍️👫👫 Entre 10 et 20 employés'
  },
  {
    value: StructureSize.PE,
    text: '‍️👫👫👫 Entre 20 et 49 employés'
  },
  {
    value: StructureSize.ME,
    text: '‍️👫👭👫👫 Entre 50 et 250 employés'
  },
  {
    value: StructureSize.ETI,
    text: '👫👭👫👫👫 Plus de 250 employés'
  },
  {
    value: StructureSize.GE,
    text: '👫👭👫👫👫👫 Plus de 500 employés'
  }
]
const resetSize = () => {
  selectedSize.value = undefined
}
</script>
