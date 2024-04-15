<template>
  <a
    :href="href"
    :class="linkClasses"
    target="_blank"
  >
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  download: boolean
}
const props = withDefaults(defineProps<Props>(), {
  download: false
})

const linkClasses = {
  'fr-btn': true,
  'fr-btn--secondary': true,
  'fr-btn--icon-left': !props.download,
  'fr-btn--icon-right': props.download,
  'fr-icon-external-link-fill': !props.download,
  'fr-icon-download-line': props.download,
  myclass: true
}

const href = props.download ? 'your-download-url' : 'your-normal-link-url'
</script>

<style scoped lang="scss">
@import '../../assets/scss/_colors.scss';

[target='_blank']:after,
[target='_blank'][class*=' fr-fi-']:after,
[target='_blank'][class*=' fr-icon-']:after,
[target='_blank'][class^='fr-fi-']:after,
[target='_blank'][class^='fr-icon-']:after {
  content: none;
}
a.myclass {
  box-shadow: inset 0 0 0 1px $secondary-purple;
  color: $secondary-purple !important;
  text-align: center;
  font-size: 14px;
}
</style>
