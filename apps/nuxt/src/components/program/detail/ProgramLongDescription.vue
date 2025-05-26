<template>
  <ProgramAccordion
    v-if="program && program['description longue']"
    id="long-description"
    :accordion-id="`${program.id}-long-description`"
    :title="Translation.t('program.programKnowMore')"
  >
    <p
      v-for="(paragraph, idx) in descriptionParagraphs"
      :key="`long-description-paragraph-${idx}`"
      :class="`fr-mb-0 fr-pb-${descriptionParagraphs.length - 1 === idx ? '3v' : '0'}`"
    >
      {{ paragraph || '&nbsp;' }}
    </p>
  </ProgramAccordion>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProgramTypeForFront } from '@/types'
import Translation from '@/tools/translation'

interface Props {
  program: ProgramTypeForFront
}
const props = defineProps<Props>()

const descriptionParagraphs = computed(() => {
  const textRaw = props.program['description longue']
  return textRaw ? textRaw.split('\n') : []
})
</script>
