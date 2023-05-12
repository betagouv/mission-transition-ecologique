<template>
  <div>
    <!-- PROGRAM RESUME -->
    <h6 
      :style="`color: ${blockColor}`"
      >
      {{ choices.t('program.programResume') }}
    </h6>
    <p
      v-if="program.resume"
      v-html="program.resume">
    </p>

    <!-- PROGRAM INFOS -->
    <!-- info blocks -->

    <!-- PROGRAM DESCRIPTION -->
    <h6
      :style="`color: ${blockColor}`">
      {{ choices.t('program.programDescription') }}
    </h6>
    <p 
      v-if="program.description"
      v-html="program.description">
    </p>
  </div>
</template>


<script setup lang="ts">

import { choicesStore } from '../stores/choices'

const choices = choicesStore()

const blockColor= 'var(--text-default-info)'

interface Props {
  program: any,
  debug?: boolean,
}
const props = defineProps<Props>()

</script>