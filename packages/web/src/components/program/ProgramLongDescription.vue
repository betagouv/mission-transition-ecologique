<template>
  <div class="fr-mb-18v fr-mt-18v">
    <h2 class="fr-mb-3v">
      {{ choices.t('program.programKnowMore') }}
    </h2>
    <hr />
    <p v-for="(paragraph, idx) in descriptionParagraphs" :key="`long-description-paragraph-${idx}`" class="fr-mb-3v">
      {{ paragraph }}
    </p>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`ProgramLongdescription > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed } from 'vue'
import { choicesStore } from '@/stores/choices'
import type { ProgramData } from '@/types'

interface Props {
  program: ProgramData
}
const props = defineProps<Props>()

const choices = choicesStore()

const descriptionParagraphs = computed(() => {
  const textRaw = props.program['description longue']
  return textRaw?.split('\n')
})
</script>
