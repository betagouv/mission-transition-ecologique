<template>
  <section>
    <!-- PROGRAM RESUME / TEXT-->
    <h2
      class="fr-text--blue-900"
      v-html="program?.promesse"
    />
    <div
      class="fr-mb-3v fr-text--blue-900"
      v-html="Marked.toHtml(program?.description)"
    />
  </section>
</template>
<script setup lang="ts">
import { Marked } from '@/tools/marked'
import AbstractProgram from '@/tools/program/abstractProgram'

const program = AbstractProgram.getCurrent()
</script>
