<template>
  <img
    class="fr-responsive-img"
    :class="getOperator && getOperator?.color ? `fr-bg--${getOperator?.color}--lightness` : ''"
    :src="getImage()"
    :alt="`image / ${currentProgram?.titre}`"
  />
</template>
<script setup lang="ts">
import { Image } from '@/tools/image'
import { Operator } from '@/tools/operator'

const { currentProgram } = storeToRefs(useProgramStore())

const img = Image.getUrl

const getOperator = computed(() => {
  if (!currentProgram.value) {
    return undefined
  }
  return new Operator().getOneByName(currentProgram.value['opérateur de contact'])
})

const getImage = () => {
  const operator = getOperator.value
  return operator?.imagePath
    ? img(operator?.imagePath, { loading: 'lazy' })
    : img(`/${currentProgram.value?.illustration}`, { height: 320, quality: 70, loading: 'lazy' })
}
</script>
