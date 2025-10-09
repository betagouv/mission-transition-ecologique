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
import { Faq } from '@/tools/faq'
import { FaqSectionType } from '@/types'

interface Props {
  faqItems: FaqSectionType[]
}
const props = defineProps<Props>()

useSchemaOrg([{ '@type': 'FAQPage', mainEntity: defineQuestions() }])

function defineQuestions() {
  const itemListElement = []
  for (const faqItem of props.faqItems) {
    const defineQuestions = Faq.defineQuestions(faqItem.questions)
    itemListElement.push(...defineQuestions)
  }

  return itemListElement
}
</script>
