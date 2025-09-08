<template>
  <div class="fr-col-12 fr-col-md-3 fr-col-lg-3 fr-col-xl-2 fr-pr-3v">
    <h2
      class="fr-h5 fr-pt-3w"
      :class="`fr-faq--${faqItem.color}`"
    >
      {{ faqItem.title }}
    </h2>
  </div>
  <div class="fr-col-12 fr-col-md-9 fr-col-justify-md--left fr-col-xl-10 fr-col-justify--center">
    <DsfrAccordionsGroup v-model="activeAccordion">
      <DsfrAccordion
        v-for="(item, index) in faqItem.questions"
        :id="`faq-${index}`"
        :key="index"
      >
        <template #title
          ><div
            class="fr-text--bold"
            v-html="Marked.toHtml(item.question, false, false)"
        /></template>
        <div v-html="Marked.toHtml(item.answer)" />
      </DsfrAccordion>
    </DsfrAccordionsGroup>
  </div>
</template>
<script lang="ts" setup>
import { FaqSection } from '@/types'
import { Marked } from '@/tools/marked'

interface Props {
  faqItem: FaqSection
}
defineProps<Props>()

const activeAccordion = ref<number>()
</script>
<style scoped lang="scss">
@use '@/assets/scss/setting';
@use 'sass:map';
@use 'sass:meta';

:deep(.fr-accordion .fr-collapse) {
  --ul-start: 3rem;
}

h2 {
  position: relative;
  word-break: break-word;
  hyphens: manual;

  @each $color, $properties in setting.$colors {
    &.fr-faq--#{$color} {
      @if meta.type-of($properties) == map {
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 48px;
          border-top: 3px solid map.get($properties, 'color');
          z-index: -1;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
