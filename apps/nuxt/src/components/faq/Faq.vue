<template>
  <div>
    <template
      v-for="(faqItem, index) in faqItems"
      :key="index"
    >
      <div
        class="fr-grid-row fr-mb-5w"
        :class="{ 'fr-mb-md-10w': index !== faqItems.length - 1 }"
      >
        <FaqSection
          v-if="faqItem"
          :faq-item="faqItem"
        />
      </div>
    </template>
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
