<template>
  <section>
    <!-- PROGRAM RESUME / TEXT-->
    <h2
      class="fr-text--blue-france"
      v-html="currentExternalProgram?.promesse"
    />
    <div
      class="fr-mb-3v fr-text--blue-france"
      v-html="Marked.toHtml(currentExternalProgram?.['description'] as string)"
    />
  </section>
</template>
<script setup lang="ts">
import { Marked } from '@/tools/marked'

const { currentExternalProgram } = storeToRefs(useExternalProgramStore())
</script>
