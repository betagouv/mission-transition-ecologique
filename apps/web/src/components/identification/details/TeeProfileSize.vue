<template id="select-company-size">
  <p
    v-if="infos.value"
    class="fr-tag fr-bg--blue-france--lightness"
  >
    {{ sizeText }}
    <span
      class="fr-icon-close-line fr-pl-4v hover-effect"
      @click="resetSize"
    />
  </p>
  <DsfrSelect
    v-else
    v-model="selectedSize"
    :default-unselected-text="defaultUnselectedText"
    :error-message="showError ? errorMessage : ''"
    :options="sizeOptions"
  />
</template>
<script lang="ts" setup>
import { RegisterDetailSize, StructureSize } from '@/types'
import Breakpoint from '@/utils/breakpoints'

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
const errorMessage = "La sélection de l'effectif est nécessaire"
const sizeText = computed(() => {
  const sizeOption = sizeOptions.find((el: { value: StructureSize; text: string }) => el.value === props.infos.value)
  return sizeOption?.text
})
const sizeOptions = [
  {
    value: StructureSize.EI,
    text: '‍️🧍Je suis un entrepreneur individuel'
  },
  {
    value: StructureSize.TPE,
    text: '‍️👫 Moins de 20 employés'
  },
  {
    value: StructureSize.PE,
    text: '‍️👫👫 Entre 20 et 49 employés'
  },
  {
    value: StructureSize.ME,
    text: '‍️👫👭👫 Entre 50 et 250 employés'
  },
  {
    value: StructureSize.ETI_GE,
    text: '👫👭👫👫 Plus de 250 employés'
  }
]
const resetSize = () => {
  selectedSize.value = undefined
}
</script>
