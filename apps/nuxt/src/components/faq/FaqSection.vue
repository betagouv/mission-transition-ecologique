<template>
  <div
    :class="[{ 'fr-col-md-3 fr-col-lg-3 fr-col-xl-2 fr-pr-3v': !isFullWidth }]"
    class="fr-col-12"
  >
    <h2
      class="fr-h5 fr-pt-3w"
      :class="`fr-faq--${faqItem.color}`"
      v-html="faqItem.title"
    />
  </div>
  <FaqQuestions :faq-questions="faqItem.questions" />
</template>
<script lang="ts" setup>
import FaqQuestions from '@/components/faq/FaqQuestions.vue'
import { FaqSectionType } from '@/types'

interface Props {
  faqItem: FaqSectionType
}
defineProps<Props>()
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
