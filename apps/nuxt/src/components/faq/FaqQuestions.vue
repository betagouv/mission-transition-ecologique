<template>
  <div
    :class="[{ 'fr-col-md-9 fr-col-xl-10': !isFullWidth }]"
    class="fr-col-12 fr-col-justify-md--left fr-col-justify--center"
  >
    <DsfrAccordionsGroup v-model="activeAccordion">
      <DsfrAccordion
        v-for="(item, index) in faqQuestions"
        :id="`faq-${index}`"
        :key="index"
        class="fr-px-md-0"
      >
        <template #title>
          <div
            class="fr-text--bold"
            v-html="Marked.toHtml(item.question, false, false)"
          />
        </template>
        <div v-html="Marked.toHtml(item.answer)" />
      </DsfrAccordion>
    </DsfrAccordionsGroup>
  </div>
</template>
<script lang="ts" setup>
import { Marked } from '@/tools/marked'
import { FaqQuestionItem } from '@tee/data'

interface Props {
  faqQuestions: FaqQuestionItem[]
  isFullWidth?: boolean
}
defineProps<Props>()

const activeAccordion = ref<number>()
</script>
