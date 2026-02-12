<template>
  <img
    class="fr-responsive-img"
    :class="getOperator && getOperator?.color ? `fr-bg--${getOperator?.color}--lightness` : ''"
    :src="getImage()"
    :alt="`image / ${program?.titre}`"
  />
</template>
<script setup lang="ts">
import { Image } from '@/tools/image'
import { Operator } from '@/tools/operator'
import AbstractProgram from '@/tools/program/abstractProgram'

const program = AbstractProgram.getCurrent()

const img = Image.getUrl

const getOperator = computed(() => {
  const operatorName = program.value?.['opérateur de contact']
  if (!operatorName) {
    return undefined
  }
  return new Operator().getOneByName(operatorName)
})

const getImage = () => {
  const operator = getOperator.value

  return operator?.imagePath
    ? img(operator?.imagePath, { loading: 'lazy' })
    : img(`/${program.value?.illustration || 'images/TEE_ampoule.webp'}`, {
        height: 320,
        quality: 70,
        loading: 'lazy'
      })
}
</script>
