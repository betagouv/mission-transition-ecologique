<template>
  <section>
    <!-- PROGRAM RESUME / TEXT-->
    <h2
      class="fr-text--blue-france"
      v-html="currentProgram?.promesse"
    />
    <div
      class="fr-mb-12v fr-text--blue-france"
      v-html="Marked.toHtml(currentProgram?.description || '')"
    />
  </section>
</template>
<script setup lang="ts">
import { Marked } from '@/tools/marked'

const { currentProgram } = storeToRefs(useProgramStore())
</script>
