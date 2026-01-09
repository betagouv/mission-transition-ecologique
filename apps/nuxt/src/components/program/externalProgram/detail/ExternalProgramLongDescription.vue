<template>
  <TeeContentBlock
    v-if="program && program['description']"
    id="long-description"
    :title="Translation.t('program.programKnowMore')"
    class="fr-py-5v fr-border-t--grey--light"
    title-class="fr-h4"
  >
    <template #content>
      <div v-html="Marked.toHtml(program['description longue'])"></div>
    </template>
  </TeeContentBlock>
</template>

<script setup lang="ts">
import type { ExternalProgramType } from '@/types'
import Translation from '@/tools/translation'
import { Marked } from '@/tools/marked'

interface Props {
  program: ExternalProgramType
}
defineProps<Props>()
</script>
