<template>
  <div class="fr-col-justify--left fr-mb-5v">
    <h1 class="fr-h6 fr-text--purple fr-mb-0">{{ currentProgram?.titre }}</h1>
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
const { currentProgram } = storeToRefs(useProgramStore())
</script>
