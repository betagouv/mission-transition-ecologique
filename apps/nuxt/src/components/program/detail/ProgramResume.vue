<template>
  <section>
    <!-- PROGRAM RESUME / TEXT-->
    <h2
      class="fr-text--blue-900"
      v-html="currentProgram?.promesse"
    />
    <div
      class="fr-mb-3v fr-text--blue-900"
      v-html="Marked.toHtml(currentProgram?.description)"
    />
  </section>
</template>
<script setup lang="ts">
import { Marked } from '@/tools/marked'

const { currentProgram } = storeToRefs(useProgramStore())
</script>
