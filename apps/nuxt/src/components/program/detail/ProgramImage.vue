<template>
  <img
    class="fr-responsive-img"
    :class="getOperator && getOperator?.color ? `fr-bg--${getOperator?.color}--lightness` : ''"
    :src="getImage()"
    :alt="`image / ${currentProgram?.titre || currentExtProgram?.titre}`"
  />
</template>
<script setup lang="ts">
import { Image } from '@/tools/image'
import { Operator } from '@/tools/operator'

const { currentProgram, currentExtProgram } = storeToRefs(useProgramStore())

const img = Image.getUrl

const getOperator = computed(() => {
  const operatorName = currentProgram.value?.['opérateur de contact'] || currentExtProgram.value?.['opérateur de contact']
  if (!operatorName) {
    return undefined
  }
  return new Operator().getOneByName(operatorName)
})

const getImage = () => {
  const operator = getOperator.value

  return operator?.imagePath
    ? img(operator?.imagePath, { loading: 'lazy' })
    : img(`/${currentProgram.value?.illustration || currentExtProgram.value?.illustration || 'images/TEE_ampoule.webp'}`, {
        height: 320,
        quality: 70,
        loading: 'lazy'
      })
}
</script>
