<template>
  <a
    :href="href"
    class="bg-none"
  >
    <button :class="linkClasses">
      <slot></slot>
    </button>
  </a>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  download: {
    type: Boolean,
    default: false
  }
})

const linkClasses = {
  'fr-btn': true,
  'fr-btn--secondary': true,
  'fr-btn--icon-left': !props.download,
  'fr-btn--icon-right': props.download,
  'fr-icon-external-link-fill': !props.download,
  'fr-icon-download-line': props.download
}

const href = props.download ? 'your-download-url' : 'your-normal-link-url'
</script>

<style scoped>
.bg-none {
  background: none;
}
</style>
