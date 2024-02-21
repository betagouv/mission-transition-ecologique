<template>
  <div class="fr-grid-row tee-input-search-and-clear">
    <slot></slot>
    <button
      v-if="hasInput"
      :class="`fr-btn fr-icon-close-line fr-btn--tertiary-no-outline tee-btn-input-large tee-btn-input-clear-btn${isLoading ? '-disabled' : ''}`"
      @click="resetInput"
    ></button>
    <slot name="search-button"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hasInput: boolean
  isLoading: boolean
}
defineProps<Props>()
const emit = defineEmits(['resetInput'])
const resetInput = () => {
  emit('resetInput')
}
</script>
