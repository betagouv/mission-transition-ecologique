<template>
  <section>
    <!-- PROGRAM RESUME / TEXT-->
    <h2
      class="fr-text--blue-900"
      v-html="currentProgram?.promesse || currentExtProgram?.promesse"
    />
    <div
      class="fr-mb-3v fr-text--blue-900"
      v-html="Marked.toHtml(currentProgram?.description || currentExtProgram?.description)"
    />
  </section>
</template>
<script setup lang="ts">
import { Marked } from '@/tools/marked'

const { currentProgram, currentExtProgram } = storeToRefs(useProgramStore())
</script>
