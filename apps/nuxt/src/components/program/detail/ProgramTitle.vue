<template>
  <ul
    v-if="programType"
    class="fr-badges-group"
  >
    <li class="fr-badge fr-badge--info fr-badge--no-icon">
      {{ programType }}
    </li>
  </ul>
  <div class="fr-col-justify--left fr-mb-5v">
    <h1 class="fr-h6 fr-text--purple fr-mb-0">{{ program?.titre }}</h1>
    <TeeCopyLinkButton
      class="fr-ml-6v fr-hidden fr-unhidden-md"
      :tertiary="true"
      :no-outline="true"
      copy-class="fr-text--green"
      text-class="fr-text--black"
    />
  </div>
</template>
<script setup lang="ts">
import AbstractProgram from '@/tools/program/abstractProgram'

const program = AbstractProgram.getCurrent()

const programType = computed(() => {
  return program.value?.["nature de l'aide"]
})
</script>
