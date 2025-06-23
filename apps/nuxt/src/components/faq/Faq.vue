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
          name: question.question,
          acceptedAnswer: Marked.toHtml(question.answer, true, false)
        })
      )
    }
  }

  return itemListElement
}
</script>
<style scoped lang="scss">
h2 {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    border-top: 3px solid #0072ff; // couleur de la bordure
    z-index: -1;
    border-radius: 2px;
  }
}
</style>
