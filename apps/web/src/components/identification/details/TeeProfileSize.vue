<template id="select-company-size">
  <div v-if="!infos.value || modifySize">
    <span class="fr-hint-text fr-text--white tee-font-style--italic">
      {{ infos.description }}
    </span>
    <DsfrSelect
      v-model="selectedSize"
      :error-message="selectedSize ? '' : errorMessage"
      :options="sizeOptions"
    />
  </div>
  <p
    v-else
    class="fr-tag"
  >
    {{ sizeText }}
    <span
      class="fr-icon-close-line"
      @click="resetSize"
    />
  </p>
</template>
<script lang="ts" setup>
import { RegisterDetailSize, StructureSize } from '@/types'

const selectedSize = defineModel<StructureSize>()
interface Props {
  infos: RegisterDetailSize
  manual: boolean
}
const props = defineProps<Props>()
const errorMessage = "La sélection de l'effectif est nécessaire"
const sizeText = computed(() => {
  const sizeOption = sizeOptions.find((el: { value: StructureSize; text: string }) => el.value === props.infos.value)
  return sizeOption?.text
})
const modifySize = ref<boolean>(false)
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
  modifySize.value = true
}
</script>
