<template>
  <div class="fr-container">
    <p
      v-for="(paragraph, idx) in descriptionParagraphs"
      :key="`long-description-paragraph-${idx}`"
      :class="`fr-mb-0 fr-pb-${descriptionParagraphs.length - 1 === idx ? '3v' : '0'}`"
    >
      {{ paragraph || '&nbsp;' }}
    </p>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`ProgramLongdescription > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed } from 'vue'
import type { ProgramTypeWithPublicode } from '@/types'

interface Props {
  program: ProgramTypeWithPublicode
}
const props = defineProps<Props>()

const descriptionParagraphs = computed(() => {
  const textRaw = props.program['description longue']
  return (textRaw as string)?.split('\n') || []
})
</script>
