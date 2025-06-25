<template>
  <div
    v-for="(faqItem, index) in faqItems"
    :key="index"
    class="fr-grid-row fr-mb-md-10w fr-mb-5w"
  >
    <FaqSection
      v-if="faqItem"
      :faq-item="faqItem"
    />
  </div>
</template>
<script lang="ts" setup>
import FaqSection from '@/components/faq/FaqSection.vue'
import { FaqItem } from '@/tools/faq/faqType'
import { Marked } from '@/tools/marked'

interface Props {
  faqItems: FaqItem[]
}
const props = defineProps<Props>()

useSchemaOrg(defineQuestions())

function defineQuestions() {
  const itemListElement = []
  for (const faqItem of props.faqItems) {
    for (const question of faqItem.questions) {
      itemListElement.push(
        defineQuestion({
          name: Marked.toHtml(question.question, false, false),
          acceptedAnswer: Marked.toHtml(question.answer, true, false)
        })
      )
    }
  }

  return itemListElement
}
</script>
