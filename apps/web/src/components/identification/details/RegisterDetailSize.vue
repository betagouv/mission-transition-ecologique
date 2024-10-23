<template id="select-company-size">
  <span class="fr-hint-text fr-text--white tee-font-style--italic">
    {{ infos.description }}
  </span>
  <DsfrSelect
    v-model="selectedSize"
    :error-message="selectedSize ? '' : errorMessage"
    :options="sizeOptions"
  />
</template>
<script lang="ts" setup>
import { RegisterDetailSize, StructureSize } from '@/types'

const selectedSize = defineModel<StructureSize>()
interface Props {
  infos: RegisterDetailSize
  manual: boolean
}
const errorMessage = "La sélection de l'effectif est nécessaire"
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
defineProps<Props>()
</script>
