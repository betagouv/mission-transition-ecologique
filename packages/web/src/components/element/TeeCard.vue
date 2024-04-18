<template>
  <div
    class="fr-grid-row"
    :class="linkClasses"
  >
    <!-- Image -->
    <div
      v-if="imglink"
      class="image-container fr-col-12 fr-col-md-3 fr-mb-2v fr-mb-md-0"
    >
      <img
        :src="imglink"
        :alt="imglink"
        class="image"
      />
    </div>
    <!-- Content -->
    <div class="content fr-col-12">
      <h1 v-if="title">{{ title }}</h1>
      <p><slot></slot></p>
      <TeeButtonExternalLink
        v-if="link"
        :href="link"
        class="fr-mt-3v"
        >{{ linkText }}</TeeButtonExternalLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
import { CardType } from '@/types/elementsPropsTypes'

interface Props {
  type?: CardType
  title?: string | number | undefined
  link?: string | undefined
  linkText?: string | undefined
  imglink?: string | undefined
}

const props = withDefaults(defineProps<Props>(), {
  type: CardType.Default,
  title: undefined,
  link: undefined,
  linkText: undefined,
  imglink: undefined
})

const linkClasses = {
  // 'fr-callout': true, //TODO check if i let it or not
  baseCardClass: true,
  defaultCard: props.type === CardType.Default,
  warningCard: props.type === CardType.Warning
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/_colors.scss';
.baseCardClass {
  border-left: 4px solid;
  padding: 32px 48px 32px 32px;
}

.defaultCard {
  background: var(--light-background-alt-blue-france, #f5f5fe);
  border-color: var(--light-border-default-blue-france, #6a6af4);
}

.warningCard {
  border-color: #fca081;
  background: rgba(252, 160, 129, 0.2);
}

h1 {
  color: var(--light-text-title-grey, #161616);
  font-family: Marianne;
  font-size: 3rem;
  font-style: normal;
  font-weight: 700;
  line-height: 3.5rem; /* 116.667% */
  margin-bottom: 0.75rem;
}

p {
  margin-bottom: 0rem;
  white-space: pre-wrap;
}

.image-container {
  margin-left: -1rem;
  margin-right: 0.2rem;
  display: flex;
  justify-content: center;
}

.image {
  max-width: 100%;
  height: auto;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>
